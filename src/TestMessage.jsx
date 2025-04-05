import React from "react";

function TestMessage({ message, type }) {
  return (
    <div className={`test-message ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default TestMessage;
