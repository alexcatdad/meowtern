import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { DataTable } from "./DataTable";

interface Row {
  name: string;
  value: number;
}

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
];

const data: Row[] = [
  { name: "beta", value: 2 },
  { name: "alpha", value: 1 },
];

describe("DataTable", () => {
  test("sorts rows when header clicked", () => {
    const { getAllByRole, getByText } = render(
      <DataTable<Row> columns={columns} data={data} />,
    );
    const rowsBefore = getAllByRole("row");
    expect(rowsBefore[1].textContent).toContain("alpha");
    fireEvent.click(getByText("Value"));
    fireEvent.click(getByText("Value"));
    const rowsAfter = getAllByRole("row");
    expect(rowsAfter[1].textContent).toContain("beta");
  });

  test("sorts string columns descending", () => {
    const { getAllByRole, getByText } = render(
      <DataTable<Row> columns={columns} data={data} />,
    );
    const header = getByText("Name");
    fireEvent.click(header);
    const rows = getAllByRole("row");
    expect(rows[1].textContent).toContain("beta");
  });

  test("renders empty state when dataset is empty", () => {
    const { getByText } = render(
      <DataTable<Row> columns={columns} data={[]} emptyState="Nothing here" />,
    );
    expect(getByText("Nothing here")).toBeDefined();
  });

  test("invokes row click handler and custom renderers", () => {
    const onRowClick = mock(() => {});
    const { getByText } = render(
      <DataTable<Row>
        columns={[
          { key: "name", label: "Name" },
          {
            key: "value",
            label: "Value",
            render: (row) => <span>Value: {row.value}</span>,
          },
        ]}
        data={data}
        onRowClick={onRowClick}
      />,
    );
    const row = getByText("beta").closest("tr");
    expect(row).toBeTruthy();
    fireEvent.click(row as HTMLElement);
    expect(onRowClick.mock.calls[0][0].name).toBe("beta");
    expect(getByText("Value: 2")).toBeDefined();
  });
});
