import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
import ballerina/lang.regexp;

public function main() returns error? {
    string logContent = string \`
        2024-09-19 10:02:01 WARN  [UserLogin] - Failed login attempt for user: johndoe
        2024-09-19 10:03:17 ERROR [Database] - Connection to database timed out
        2024-09-19 10:04:05 WARN  [RequestHandler] - Response time exceeded threshold for /api/v1/users
        2024-09-19 10:05:45 INFO  [Scheduler] - Scheduled task started: Data backup
        2024-09-19 10:06:10 ERROR [Scheduler] - Failed to start data backup: Permission denied
        2024-09-19 10:11:55 INFO  [Security] - Security scan completed, no issues found
        2024-09-19 10:12:30 ERROR [RequestHandler] - 404 Not Found: /api/v1/products\`;

    // Regular expression to match error logs with three groups:
    // 1. Timestamp (e.g., 2024-09-19 10:03:17).
    // 2. Component (e.g., Database, Scheduler).
    // 3. Log message (e.g., Connection to database timed out).
    string:RegExp errorLogPattern = re \`(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}) ERROR \\[(\\w+)\\]\\s-\\s(.*)\`;

    // Retrieve the first error log from \`logContent\`.
    regexp:Span? firstErrorLog = errorLogPattern.find(logContent);
    if firstErrorLog == () {
        io:println("Failed to find a error log");
        return;
    }
    io:println("First error log: ", firstErrorLog.substring());

    // Retrieve all error logs from the \`logContent\`.
    regexp:Span[] allErrorLogs = errorLogPattern.findAll(logContent);
    io:println("\\nAll error logs:");
    foreach regexp:Span errorLog in allErrorLogs {
        io:println(errorLog.substring());
    }

    // Retrieve groups (timestamp, component, message) from the first error log.
    regexp:Groups? firstErrorLogGroups = errorLogPattern.findGroups(logContent);
    if firstErrorLogGroups == () {
        io:println("Failed to find groups in first error log");
        return;
    }
    io:println("\\nGroups within first error log:");
    check printGroupsWithinLog(firstErrorLogGroups);

    // Retrieve groups from all error logs.
    regexp:Groups[] allErrorLogGroups = errorLogPattern.findAllGroups(logContent);
    io:println("\\nGroups in all error logs");
    foreach regexp:Groups logGroup in allErrorLogGroups {
        check printGroupsWithinLog(logGroup);
    }
}

function printGroupsWithinLog(regexp:Groups logGroup) returns error? {
    // The first element in the \`logGroup\` is the entire matched string.
    // The subsequent elements in \`logGroup\` represent the captured groups 
    // (timestamp, component, message).
    string timestamp = (check logGroup[1].ensureType(regexp:Span)).substring();
    string component = (check logGroup[2].ensureType(regexp:Span)).substring();
    string logMessage = (check logGroup[3].ensureType(regexp:Span)).substring();

    io:println("Timestamp: ", timestamp);
    io:println("Component: ", component);
    io:println("Message: ", logMessage);
}
`,
];

export function RegexpFindOperations({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>RegExp find operations</h1>

      <p>
        The <code>RegExp</code> type provides a set of langlib functions to find
        patterns within strings. These functions enable efficient pattern
        matching, grouping, and extraction based on specific regular
        expressions.
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2  ms-auto"
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2  ms-auto"
              onClick={() => {
                updateCodeClick1(true);
                copyToClipboard(codeSnippetData[0]);
                setTimeout(() => {
                  updateCodeClick1(false);
                }, 3000);
              }}
              aria-label="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-clipboard"
                viewBox="0 0 16 16"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
      </Row>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              onClick={() => {
                updateOutputClick1(true);
                const extractedText = extractOutput(ref1.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick1(false);
                }, 3000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#EEEEEE"
                className="output-btn bi bi-clipboard"
                viewBox="0 0 16 16"
                aria-label="Copy to Clipboard"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`\$ bal run regexp_find_operations.bal`}</span>
              <span>{`First error log: 2024-09-19 10:03:17 ERROR [Database] - Connection to database timed out`}</span>
              <span>{`
`}</span>
              <span>{`All error logs:`}</span>
              <span>{`2024-09-19 10:03:17 ERROR [Database] - Connection to database timed out`}</span>
              <span>{`2024-09-19 10:06:10 ERROR [Scheduler] - Failed to start data backup: Permission denied`}</span>
              <span>{`2024-09-19 10:12:30 ERROR [RequestHandler] - 404 Not Found: /api/v1/products`}</span>
              <span>{`
`}</span>
              <span>{`Groups within first error log:`}</span>
              <span>{`Timestamp: 2024-09-19 10:03:17`}</span>
              <span>{`Component: Database`}</span>
              <span>{`Message: Connection to database timed out`}</span>
              <span>{`
`}</span>
              <span>{`Groups in all error logs`}</span>
              <span>{`Timestamp: 2024-09-19 10:03:17`}</span>
              <span>{`Component: Database`}</span>
              <span>{`Message: Connection to database timed out`}</span>
              <span>{`Timestamp: 2024-09-19 10:06:10`}</span>
              <span>{`Component: Scheduler`}</span>
              <span>{`Message: Failed to start data backup: Permission denied`}</span>
              <span>{`Timestamp: 2024-09-19 10:12:30`}</span>
              <span>{`Component: RequestHandler`}</span>
              <span>{`Message: 404 Not Found: /api/v1/products`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/regexp-type">RegExp type</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/lang.regexp">
              RegExp API Docs
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/lang.string">
              string API Docs
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="RegExp replace operations"
            href="/learn/by-example/regexp-replace-operations"
          >
            <div className="btnContainer d-flex align-items-center me-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  RegExp replace operations
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="RegExp match operations"
            href="/learn/by-example/regexp-match-operations"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  RegExp match operations
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[1] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}