import { describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { ProcessList } from "./ProcessList";

describe("ProcessList", () => {
  test("invokes action callbacks", () => {
    const terminated: number[] = [];
    const restarted: number[] = [];
    const processes = [
      { pid: 1, name: "init", cpu: 10, memory: 1024, status: "running" },
    ];
    const { getByText } = render(
      <ProcessList
        processes={processes}
        onTerminate={(pid) => terminated.push(pid)}
        onRestart={(pid) => restarted.push(pid)}
      />,
    );
    fireEvent.click(getByText("Restart"));
    expect(restarted).toContain(1);
    fireEvent.click(getByText("Kill"));
    expect(terminated).toContain(1);
  });
});
