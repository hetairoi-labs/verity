import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
	type FastChatInput,
	useFastChatStream,
} from "@/src/lib/hooks/api/use-ai-api";
import { cn } from "@/src/lib/utils";

type Role = FastChatInput["conversationHistory"][number]["role"];

interface ChatMessage {
	id: string;
	role: Role;
	content: string;
}

const starterMessages: ChatMessage[] = [
	{
		id: "assistant-starter",
		role: "assistant",
		content: "Hey. What's up?",
	},
];

const markdownBaseClassName =
	"max-w-none text-foreground prose prose-sm dark:prose-invert prose-p:my-3 prose-li:my-1 prose-strong:text-foreground prose-em:text-foreground/90";

const markdownComponents: Components = {
	h1: ({ children }) => (
		<h1 className="mb-3 border-b border-primary/30 pb-2 text-xl font-semibold text-primary">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mb-2 mt-5 text-lg font-semibold text-primary">{children}</h2>
	),
	h3: ({ children }) => (
		<h3 className="mb-2 mt-4 text-base font-semibold text-foreground">{children}</h3>
	),
	hr: () => <hr className="my-5 border-border/80" />,
	ul: ({ children }) => (
		<ul className="my-3 list-disc space-y-1 pl-5 marker:text-primary">{children}</ul>
	),
	ol: ({ children }) => (
		<ol className="my-3 list-decimal space-y-1 pl-5 marker:text-primary">
			{children}
		</ol>
	),
	a: ({ href, children }) => (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
		>
			{children}
		</a>
	),
	blockquote: ({ children }) => (
		<blockquote className="my-4 rounded-r-lg border-l-4 border-primary/50 bg-muted/40 px-4 py-2 italic text-muted-foreground">
			{children}
		</blockquote>
	),
	pre: ({ children }) => (
		<pre className="my-3 overflow-x-auto rounded-xl border border-border bg-card p-4 text-[13px] leading-6 shadow-sm">
			{children}
		</pre>
	),
	code: ({ className, children }) => {
		const isBlock = className?.includes("language-");
		if (isBlock) {
			return (
				<code className={cn("font-mono text-[13px] text-foreground", className)}>
					{children}
				</code>
			);
		}

		return (
			<code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[13px] text-primary">
				{children}
			</code>
		);
	},
	table: ({ children }) => (
		<div className="my-4 overflow-x-auto rounded-xl border border-border">
			<table className="w-full border-collapse text-left text-sm">{children}</table>
		</div>
	),
	thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
	th: ({ children }) => (
		<th className="border-b border-border px-3 py-2 font-semibold text-foreground">
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className="border-b border-border/60 px-3 py-2 align-top text-foreground/90">
			{children}
		</td>
	),
};

function MessageBubble({ message }: { message: ChatMessage }) {
	const isUser = message.role === "user";

	return (
		<div
			className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
		>
			<div className={cn("max-w-[85%]", !isUser && "w-full")}>
				<p
					className={cn(
						"mb-1 px-1 text-xs text-muted-foreground/90",
						isUser ? "text-right" : "text-left",
					)}
				>
					{isUser ? "You" : "Assistant"}
				</p>
				<div
					className={cn(
						"whitespace-pre-wrap px-4 py-3 text-sm leading-7",
						isUser
							? "rounded-2xl rounded-br-md border border-primary/50 bg-primary text-primary-foreground shadow-sm"
							: "text-foreground",
					)}
				>
					{isUser ? (
						message.content
					) : (
						<div className={markdownBaseClassName}>
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={markdownComponents}
							>
								{message.content}
							</ReactMarkdown>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ChatTestPage() {
	const { streamChat } = useFastChatStream();
	const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messageEndRef = useRef<HTMLDivElement | null>(null);
	const messageCount = messages.length;

	useEffect(() => {
		if (messageCount < 1) return;
		messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messageCount]);

	const handleSend = async () => {
		const text = input.trim();
		if (!text || isStreaming) return;

		const conversationHistory: FastChatInput["conversationHistory"] =
			messages.map((message) => ({
				role: message.role,
				content: message.content,
			}));

		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: text,
		};
		const assistantMessageId = crypto.randomUUID();

		setMessages((current) => [
			...current,
			userMessage,
			{ id: assistantMessageId, role: "assistant", content: "" },
		]);
		setInput("");
		setError(null);
		setIsStreaming(true);

		try {
			const stream = await streamChat({
				message: text,
				conversationHistory,
			});

			for await (const chunk of stream) {
				if (!chunk || typeof chunk !== "object" || !("text" in chunk)) continue;
				const piece = chunk.text;
				if (typeof piece !== "string") continue;

				setMessages((current) =>
					current.map((message) =>
						message.id === assistantMessageId
							? { ...message, content: `${message.content}${piece}` }
							: message,
					),
				);
			}
		} catch (streamError) {
			setError(
				streamError instanceof Error
					? streamError.message
					: "Failed to stream chat response",
			);
			setMessages((current) =>
				current.filter((message) => message.id !== assistantMessageId),
			);
		} finally {
			setIsStreaming(false);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="sticky top-0 z-10 bg-background/90 backdrop-blur">
				<div className="mx-auto max-w-4xl px-4 py-4">
					<h1 className="text-lg font-medium">Fast Chat</h1>
					<p className="text-sm text-muted-foreground">Cerebras Inference</p>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-4 py-8 pb-32">
				<div className="space-y-6">
					{messages.map((message) => (
						<MessageBubble key={message.id} message={message} />
					))}

					{isStreaming && (
						<p className="px-1 text-xs text-muted-foreground">Streaming...</p>
					)}
					{error && <p className="px-1 text-xs text-destructive">{error}</p>}
					<div ref={messageEndRef} />
				</div>
			</main>

			<div className="fixed inset-x-0 bottom-0 bg-background/95 backdrop-blur">
				<div className="mx-auto max-w-4xl px-4 py-4">
					<div className="flex w-full items-center gap-2 rounded-2xl border bg-card p-2">
						<Input
							value={input}
							placeholder="Ask anything..."
							className="border-0 bg-transparent shadow-none focus-visible:ring-0"
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									void handleSend();
								}
							}}
							disabled={isStreaming}
						/>
						<Button
							onClick={() => void handleSend()}
							disabled={!input.trim() || isStreaming}
							className="rounded-xl"
						>
							Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/test/chat/")({
	component: ChatTestPage,
});
