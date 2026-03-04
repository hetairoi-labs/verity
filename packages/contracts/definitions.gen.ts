export const definitions = {
	test: {
		USDC: {
			address: "0xe2e205b2682a03e404f99491c96e756d61e4f733",
			abi: [
				{
					inputs: [
						{
							internalType: "uint256",
							name: "initialSupply_",
							type: "uint256",
						},
					],
					stateMutability: "nonpayable",
					type: "constructor",
				},
				{
					inputs: [
						{ internalType: "address", name: "spender", type: "address" },
						{ internalType: "uint256", name: "allowance", type: "uint256" },
						{ internalType: "uint256", name: "needed", type: "uint256" },
					],
					name: "ERC20InsufficientAllowance",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "sender", type: "address" },
						{ internalType: "uint256", name: "balance", type: "uint256" },
						{ internalType: "uint256", name: "needed", type: "uint256" },
					],
					name: "ERC20InsufficientBalance",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "approver", type: "address" },
					],
					name: "ERC20InvalidApprover",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "receiver", type: "address" },
					],
					name: "ERC20InvalidReceiver",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "sender", type: "address" },
					],
					name: "ERC20InvalidSender",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "spender", type: "address" },
					],
					name: "ERC20InvalidSpender",
					type: "error",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "owner",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "spender",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "value",
							type: "uint256",
						},
					],
					name: "Approval",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "from",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "to",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "value",
							type: "uint256",
						},
					],
					name: "Transfer",
					type: "event",
				},
				{
					inputs: [
						{ internalType: "address", name: "owner", type: "address" },
						{ internalType: "address", name: "spender", type: "address" },
					],
					name: "allowance",
					outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "spender", type: "address" },
						{ internalType: "uint256", name: "value", type: "uint256" },
					],
					name: "approve",
					outputs: [{ internalType: "bool", name: "", type: "bool" }],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "account", type: "address" },
					],
					name: "balanceOf",
					outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "decimals",
					outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [],
					name: "name",
					outputs: [{ internalType: "string", name: "", type: "string" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "symbol",
					outputs: [{ internalType: "string", name: "", type: "string" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "totalSupply",
					outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "to", type: "address" },
						{ internalType: "uint256", name: "value", type: "uint256" },
					],
					name: "transfer",
					outputs: [{ internalType: "bool", name: "", type: "bool" }],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "from", type: "address" },
						{ internalType: "address", name: "to", type: "address" },
						{ internalType: "uint256", name: "value", type: "uint256" },
					],
					name: "transferFrom",
					outputs: [{ internalType: "bool", name: "", type: "bool" }],
					stateMutability: "nonpayable",
					type: "function",
				},
			],
		},
		KXManager: {
			address: "0x6ee50eeafa56f269a8875bb09e2a3ab9608bdf4b",
			abi: [
				{
					inputs: [
						{ internalType: "address", name: "usdc_", type: "address" },
						{ internalType: "address", name: "forwarder_", type: "address" },
					],
					stateMutability: "nonpayable",
					type: "constructor",
				},
				{ inputs: [], name: "AmountZero", type: "error" },
				{
					inputs: [
						{ internalType: "address", name: "received", type: "address" },
						{ internalType: "address", name: "expected", type: "address" },
					],
					name: "InvalidAuthor",
					type: "error",
				},
				{ inputs: [], name: "InvalidForwarderAddress", type: "error" },
				{
					inputs: [
						{ internalType: "address", name: "sender", type: "address" },
						{ internalType: "address", name: "expected", type: "address" },
					],
					name: "InvalidSender",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "bytes32", name: "received", type: "bytes32" },
						{ internalType: "bytes32", name: "expected", type: "bytes32" },
					],
					name: "InvalidWorkflowId",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "bytes10", name: "received", type: "bytes10" },
						{ internalType: "bytes10", name: "expected", type: "bytes10" },
					],
					name: "InvalidWorkflowName",
					type: "error",
				},
				{ inputs: [], name: "NotLearner", type: "error" },
				{
					inputs: [{ internalType: "address", name: "owner", type: "address" }],
					name: "OwnableInvalidOwner",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "account", type: "address" },
					],
					name: "OwnableUnauthorizedAccount",
					type: "error",
				},
				{
					inputs: [],
					name: "WorkflowNameRequiresAuthorValidation",
					type: "error",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousAuthor",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newAuthor",
							type: "address",
						},
					],
					name: "ExpectedAuthorUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "bytes32",
							name: "previousId",
							type: "bytes32",
						},
						{
							indexed: true,
							internalType: "bytes32",
							name: "newId",
							type: "bytes32",
						},
					],
					name: "ExpectedWorkflowIdUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "bytes10",
							name: "previousName",
							type: "bytes10",
						},
						{
							indexed: true,
							internalType: "bytes10",
							name: "newName",
							type: "bytes10",
						},
					],
					name: "ExpectedWorkflowNameUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousForwarder",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newForwarder",
							type: "address",
						},
					],
					name: "ForwarderAddressUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousOwner",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newOwner",
							type: "address",
						},
					],
					name: "OwnershipTransferred",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: false,
							internalType: "string",
							name: "message",
							type: "string",
						},
					],
					name: "SecurityWarning",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: false,
							internalType: "uint256",
							name: "index",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "string",
							name: "dataCID",
							type: "string",
						},
					],
					name: "SessionDataCIDAdded",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "teacher",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "learner",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "amount",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "string",
							name: "dataCID",
							type: "string",
						},
					],
					name: "SessionRegistered",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "teacher",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "learner",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "amount",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "string",
							name: "meetingLink",
							type: "string",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "partialDataCIDIndex",
							type: "uint256",
						},
					],
					name: "SessionRegistrationRequested",
					type: "event",
				},
				{
					inputs: [
						{ internalType: "string", name: "dataCID_", type: "string" },
					],
					name: "addSessionDataCID",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedAuthor",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedWorkflowId",
					outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedWorkflowName",
					outputs: [{ internalType: "bytes10", name: "", type: "bytes10" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getForwarderAddress",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "bytes", name: "metadata", type: "bytes" },
						{ internalType: "bytes", name: "report", type: "bytes" },
					],
					name: "onReport",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "owner",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "renounceOwnership",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "teacher_", type: "address" },
						{ internalType: "address", name: "learner_", type: "address" },
						{ internalType: "uint256", name: "amount_", type: "uint256" },
						{ internalType: "string", name: "meetingLink_", type: "string" },
						{
							internalType: "uint256",
							name: "partialDataCIDIndex_",
							type: "uint256",
						},
					],
					name: "requestSessionRegistration",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					name: "sessionDataCIDs",
					outputs: [{ internalType: "string", name: "", type: "string" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "sessionRegistry",
					outputs: [
						{
							internalType: "contract KXSessionRegistry",
							name: "",
							type: "address",
						},
					],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "_author", type: "address" },
					],
					name: "setExpectedAuthor",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
					name: "setExpectedWorkflowId",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "string", name: "_name", type: "string" }],
					name: "setExpectedWorkflowName",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "_forwarder", type: "address" },
					],
					name: "setForwarderAddress",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "bytes4", name: "interfaceId", type: "bytes4" },
					],
					name: "supportsInterface",
					outputs: [{ internalType: "bool", name: "", type: "bool" }],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "newOwner", type: "address" },
					],
					name: "transferOwnership",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "usdc",
					outputs: [
						{ internalType: "contract IERC20", name: "", type: "address" },
					],
					stateMutability: "view",
					type: "function",
				},
			],
		},
		KXSessionRegistry: {
			address: "0x607e29fdBBD417739e72b69e23fd24815aba8880",
			abi: [
				{
					inputs: [
						{ internalType: "address", name: "manager_", type: "address" },
						{ internalType: "address", name: "forwarder_", type: "address" },
					],
					stateMutability: "nonpayable",
					type: "constructor",
				},
				{ inputs: [], name: "AlreadyFunded", type: "error" },
				{ inputs: [], name: "AlreadyPredicted", type: "error" },
				{ inputs: [], name: "AmountZero", type: "error" },
				{ inputs: [], name: "DisputeWindowPassed", type: "error" },
				{
					inputs: [
						{ internalType: "address", name: "received", type: "address" },
						{ internalType: "address", name: "expected", type: "address" },
					],
					name: "InvalidAuthor",
					type: "error",
				},
				{ inputs: [], name: "InvalidForwarderAddress", type: "error" },
				{
					inputs: [
						{ internalType: "address", name: "sender", type: "address" },
						{ internalType: "address", name: "expected", type: "address" },
					],
					name: "InvalidSender",
					type: "error",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "InvalidSessionId",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "bytes32", name: "received", type: "bytes32" },
						{ internalType: "bytes32", name: "expected", type: "bytes32" },
					],
					name: "InvalidWorkflowId",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "bytes10", name: "received", type: "bytes10" },
						{ internalType: "bytes10", name: "expected", type: "bytes10" },
					],
					name: "InvalidWorkflowName",
					type: "error",
				},
				{ inputs: [], name: "NotEvaluatable", type: "error" },
				{ inputs: [], name: "NotFinalized", type: "error" },
				{ inputs: [], name: "NotFunded", type: "error" },
				{ inputs: [], name: "NotLearner", type: "error" },
				{ inputs: [], name: "NotManager", type: "error" },
				{ inputs: [], name: "NotParticipant", type: "error" },
				{ inputs: [], name: "NotTeacher", type: "error" },
				{
					inputs: [{ internalType: "address", name: "owner", type: "address" }],
					name: "OwnableInvalidOwner",
					type: "error",
				},
				{
					inputs: [
						{ internalType: "address", name: "account", type: "address" },
					],
					name: "OwnableUnauthorizedAccount",
					type: "error",
				},
				{ inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
				{
					inputs: [{ internalType: "address", name: "token", type: "address" }],
					name: "SafeERC20FailedOperation",
					type: "error",
				},
				{
					inputs: [],
					name: "WorkflowNameRequiresAuthorValidation",
					type: "error",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "string",
							name: "dataCID",
							type: "string",
						},
					],
					name: "EvaluationRequested",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousAuthor",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newAuthor",
							type: "address",
						},
					],
					name: "ExpectedAuthorUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "bytes32",
							name: "previousId",
							type: "bytes32",
						},
						{
							indexed: true,
							internalType: "bytes32",
							name: "newId",
							type: "bytes32",
						},
					],
					name: "ExpectedWorkflowIdUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "bytes10",
							name: "previousName",
							type: "bytes10",
						},
						{
							indexed: true,
							internalType: "bytes10",
							name: "newName",
							type: "bytes10",
						},
					],
					name: "ExpectedWorkflowNameUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousForwarder",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newForwarder",
							type: "address",
						},
					],
					name: "ForwarderAddressUpdated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: true,
							internalType: "address",
							name: "learner",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "amount",
							type: "uint256",
						},
					],
					name: "LearnerClaimed",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "address",
							name: "previousOwner",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "newOwner",
							type: "address",
						},
					],
					name: "OwnershipTransferred",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: false,
							internalType: "string",
							name: "message",
							type: "string",
						},
					],
					name: "SecurityWarning",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: true,
							internalType: "address",
							name: "disputedBy",
							type: "address",
						},
					],
					name: "SessionDisputed",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "uint16",
							name: "confidenceBps",
							type: "uint16",
						},
						{
							indexed: false,
							internalType: "uint16",
							name: "learningBps",
							type: "uint16",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "teacherClaimable",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "learnerRefundable",
							type: "uint256",
						},
						{
							indexed: false,
							internalType: "string",
							name: "evidenceURI",
							type: "string",
						},
					],
					name: "SessionEvaluated",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
					],
					name: "SessionFinalized",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: true,
							internalType: "address",
							name: "learner",
							type: "address",
						},
					],
					name: "SessionFunded",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: true,
							internalType: "address",
							name: "teacher",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "learner",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "amount",
							type: "uint256",
						},
					],
					name: "SessionRegistered",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{
							indexed: true,
							internalType: "uint256",
							name: "sessionId",
							type: "uint256",
						},
						{
							indexed: true,
							internalType: "address",
							name: "teacher",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "amount",
							type: "uint256",
						},
					],
					name: "TeacherClaimed",
					type: "event",
				},
				{
					inputs: [],
					name: "DISPUTE_WINDOW",
					outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "claimLearner",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "claimTeacher",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "dispute",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "finalize",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "fundSessionEscrow",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedAuthor",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedWorkflowId",
					outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getExpectedWorkflowName",
					outputs: [{ internalType: "bytes10", name: "", type: "bytes10" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getForwarderAddress",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "manager",
					outputs: [
						{ internalType: "contract KXManager", name: "", type: "address" },
					],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "nextEscrowId",
					outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "bytes", name: "metadata", type: "bytes" },
						{ internalType: "bytes", name: "report", type: "bytes" },
					],
					name: "onReport",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "owner",
					outputs: [{ internalType: "address", name: "", type: "address" }],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "teacher_", type: "address" },
						{ internalType: "address", name: "learner_", type: "address" },
						{ internalType: "uint256", name: "amount_", type: "uint256" },
						{ internalType: "string", name: "dataCID_", type: "string" },
					],
					name: "registerSessionAsManager",
					outputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "renounceOwnership",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
					name: "requestEvaluation",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
					name: "sessions",
					outputs: [
						{ internalType: "address", name: "teacher", type: "address" },
						{ internalType: "address", name: "learner", type: "address" },
						{ internalType: "uint256", name: "amount", type: "uint256" },
						{
							internalType: "enum KXSessionRegistry.Status",
							name: "status",
							type: "uint8",
						},
						{ internalType: "uint16", name: "confidenceBps", type: "uint16" },
						{ internalType: "uint16", name: "learningBps", type: "uint16" },
						{
							internalType: "uint256",
							name: "teacherClaimable",
							type: "uint256",
						},
						{
							internalType: "uint256",
							name: "learnerRefundable",
							type: "uint256",
						},
						{ internalType: "uint256", name: "evaluatedAt", type: "uint256" },
						{ internalType: "string", name: "dataCID", type: "string" },
						{ internalType: "string", name: "evidenceCID", type: "string" },
					],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "_author", type: "address" },
					],
					name: "setExpectedAuthor",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
					name: "setExpectedWorkflowId",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{ internalType: "string", name: "_name", type: "string" }],
					name: "setExpectedWorkflowName",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "_forwarder", type: "address" },
					],
					name: "setForwarderAddress",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "bytes4", name: "interfaceId", type: "bytes4" },
					],
					name: "supportsInterface",
					outputs: [{ internalType: "bool", name: "", type: "bool" }],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [
						{ internalType: "address", name: "newOwner", type: "address" },
					],
					name: "transferOwnership",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
			],
		},
	},
} as const;
