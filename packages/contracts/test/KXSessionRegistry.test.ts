import { describe, expect, it } from "bun:test";
import { network } from "hardhat";

describe("KXSessionRegistry", async () => {
	const { viem } = await network.connect();
	// const publicClient = await viem.getPublicClient();
	const [deployer, teacher, learner, other] = await viem.getWalletClients();

	const usdc = await viem.deployContract("testUSDC", [1000000000000n]);
	const manager = await viem.deployContract("KXManager", [usdc.address]);
	const registry = await viem.deployContract("KXSessionRegistry", [
		manager.address,
		deployer.account.address,
	]);

	await usdc.write.transfer([learner.account.address, 1000000n], {
		account: deployer.account,
	});

	it("should register a session", async () => {
		const amount = 100n;
		const dataCID = "test-data-cid";

		await registry.write.registerSession(
			[teacher.account.address, learner.account.address, amount, dataCID],
			{ account: deployer.account },
		);

		expect(await registry.read.nextEscrowId()).toBe(1n);
	});

	it("should fund the session escrow", async () => {
		const sessionId = 0n;
		const amount = 100n;

		// Approve registry to spend USDC
		await usdc.write.approve([registry.address, amount], {
			account: learner.account,
		});

		await registry.write.fundSessionEscrow([sessionId], {
			account: learner.account,
		});
	});

	it("should request evaluation", async () => {
		const sessionId = 0n;

		await registry.write.requestEvaluation([sessionId], {
			account: teacher.account,
		});
	});

	it("should request session registration", async () => {
		const amount = 100n;
		const meetingLink = "https://meet.google.com/abc";
		const partialDataCIDIndex = 0n;

		// Add data CID first
		await manager.write.addSessionDataCID(["test-data-cid"], {
			account: deployer.account,
		});

		// Approve USDC for transfer
		await usdc.write.approve([manager.address, amount], {
			account: learner.account,
		});

		// Request session registration
		const tx = await manager.write.requestSessionRegistration(
			[
				teacher.account.address,
				learner.account.address,
				amount,
				meetingLink,
				partialDataCIDIndex,
			],
			{ account: learner.account },
		);
		console.log("Request tx hash:", tx);
	});

	// Error tests
	it("should revert on register with zero amount", async () => {
		expect(
			registry.write.registerSession(
				[teacher.account.address, learner.account.address, 0n, "cid"],
				{ account: deployer.account },
			),
		).rejects.toThrow("AmountZero");
	});

	it("should revert on fund if not learner", async () => {
		const sessionId = 1n;
		await registry.write.registerSession(
			[teacher.account.address, learner.account.address, 100n, "cid"],
			{ account: deployer.account },
		);

		expect(
			registry.write.fundSessionEscrow([sessionId], { account: other.account }),
		).rejects.toThrow("NotLearner");
	});

	it("should revert on fund if already funded", async () => {
		const sessionId = 1n;
		await usdc.write.approve([registry.address, 100n], {
			account: learner.account,
		});

		await registry.write.fundSessionEscrow([sessionId], {
			account: learner.account,
		});

		expect(
			registry.write.fundSessionEscrow([sessionId], {
				account: learner.account,
			}),
		).rejects.toThrow("AlreadyFunded");
	});
});
