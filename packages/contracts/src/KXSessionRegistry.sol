// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReceiverTemplate} from "./interfaces/ReceiverTemplate.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./KXManager.sol";

contract KXSessionRegistry is ReceiverTemplate, ReentrancyGuard {
    using SafeERC20 for IERC20;

    KXManager public immutable manager;
    uint256 public nextEscrowId;
    uint256 public constant DISPUTE_WINDOW = 1 days;

    enum Status {
        None,
        Funded,
        Evaluated,
        Disputed,
        Finalized
    }

    struct Session {
        address teacher;
        address learner;
        uint256 amount;
        Status status;
        uint16 confidenceBps;
        uint16 learningBps;
        uint256 teacherClaimable;
        uint256 learnerRefundable;
        uint256 evaluatedAt;
        string dataCID;
        string evidenceCID;
    }

    mapping(uint256 => Session) public sessions;

    // Events
    event SessionRegistered(
        uint256 indexed sessionId,
        address indexed teacher,
        address indexed learner,
        uint256 amount
    );
    event SessionFunded(uint256 indexed sessionId, address indexed learner);
    event SessionEvaluated(
        uint256 indexed sessionId,
        uint16 confidenceBps,
        uint16 learningBps,
        uint256 teacherClaimable,
        uint256 learnerRefundable,
        string evidenceURI
    );
    event SessionDisputed(
        uint256 indexed sessionId,
        address indexed disputedBy
    );
    event SessionFinalized(uint256 indexed sessionId);
    event TeacherClaimed(
        uint256 indexed sessionId,
        address indexed teacher,
        uint256 amount
    );
    event LearnerClaimed(
        uint256 indexed sessionId,
        address indexed learner,
        uint256 amount
    );
    event EvaluationRequested(uint256 indexed sessionId, string dataCID);

    error InvalidSessionId(uint256 id);
    error AmountZero();
    error AlreadyPredicted();
    error NotParticipant();
    error AlreadyFunded();
    error NotFunded();
    error NotEvaluatable();
    error DisputeWindowPassed();
    error NotFinalized();
    error NotTeacher();
    error NotLearner();
    error NotManager();

    modifier onlyManager() {
        if (msg.sender != address(manager)) revert NotManager();
        _;
    }

    constructor(
        address manager_,
        address forwarder_
    ) ReceiverTemplate(forwarder_) {
        manager = KXManager(manager_);
    }

    function registerSessionAsManager(
        address teacher_,
        address learner_,
        uint256 amount_,
        string calldata dataCID_
    ) external onlyManager returns (uint256 id) {
        if (amount_ == 0) revert AmountZero();

        id = nextEscrowId++;

        sessions[id] = Session({
            teacher: teacher_,
            learner: learner_,
            amount: amount_,
            status: Status.None,
            confidenceBps: 0,
            learningBps: 0,
            teacherClaimable: 0,
            learnerRefundable: 0,
            evaluatedAt: 0,
            dataCID: dataCID_,
            evidenceCID: ""
        });

        emit SessionRegistered(id, teacher_, learner_, amount_);
    }

    function fundSessionEscrow(uint256 id) external nonReentrant {
        Session storage session = sessions[id];

        if (session.status != Status.None) revert AlreadyFunded();
        if (msg.sender != session.learner) revert NotLearner();

        manager.usdc().safeTransferFrom(
            msg.sender,
            address(this),
            session.amount
        );

        session.status = Status.Funded;

        emit SessionFunded(id, msg.sender);
    }

    function requestEvaluation(uint256 id) external {
        Session storage session = sessions[id];

        if (msg.sender != session.teacher) revert NotTeacher();
        if (session.status != Status.Funded) revert NotFunded();

        emit EvaluationRequested(id, session.dataCID);
    }

    function _processReport(bytes calldata report) internal override {
        (
            uint256 id,
            uint16 confidenceBps,
            uint16 learningBps,
            string memory evidenceCID
        ) = abi.decode(report, (uint256, uint16, uint16, string));

        Session storage session = sessions[id];

        if (session.status != Status.Funded) revert NotFunded();

        uint16 effective = (confidenceBps + learningBps) / 2;

        uint256 teacherShareBps = (uint256(effective) * uint256(effective)) /
            10000;

        uint256 teacherAmount = (session.amount * teacherShareBps) / 10000;

        session.confidenceBps = confidenceBps;
        session.learningBps = learningBps;
        session.teacherClaimable = teacherAmount;
        session.learnerRefundable = session.amount - teacherAmount;
        session.evaluatedAt = block.timestamp;
        session.evidenceCID = evidenceCID;
        session.status = Status.Evaluated;

        emit SessionEvaluated(
            id,
            confidenceBps,
            learningBps,
            teacherAmount,
            session.amount - teacherAmount,
            evidenceCID
        );
    }

    function dispute(uint256 id) external {
        Session storage session = sessions[id];

        if (msg.sender != session.teacher && msg.sender != session.learner) {
            revert NotParticipant();
        }
        if (session.status != Status.Evaluated) revert NotEvaluatable();
        if (block.timestamp > session.evaluatedAt + DISPUTE_WINDOW) {
            revert DisputeWindowPassed();
        }

        session.status = Status.Disputed;

        emit SessionDisputed(id, msg.sender);
    }

    function finalize(uint256 id) public {
        Session storage session = sessions[id];

        if (session.status != Status.Evaluated) revert NotEvaluatable();
        if (block.timestamp <= session.evaluatedAt + DISPUTE_WINDOW) {
            revert DisputeWindowPassed();
        }

        session.status = Status.Finalized;

        emit SessionFinalized(id);
    }

    function claimTeacher(uint256 id) external nonReentrant {
        Session storage session = sessions[id];

        if (session.status != Status.Finalized) revert NotFinalized();
        if (msg.sender != session.teacher) revert NotTeacher();

        uint256 amount = session.teacherClaimable;
        session.teacherClaimable = 0;

        manager.usdc().safeTransfer(msg.sender, amount);

        emit TeacherClaimed(id, msg.sender, amount);
    }

    function claimLearner(uint256 id) external nonReentrant {
        Session storage session = sessions[id];

        if (session.status != Status.Finalized) revert NotFinalized();
        if (msg.sender != session.learner) revert NotLearner();

        uint256 amount = session.learnerRefundable;
        session.learnerRefundable = 0;

        manager.usdc().safeTransfer(msg.sender, amount);

        emit LearnerClaimed(id, msg.sender, amount);
    }
}
