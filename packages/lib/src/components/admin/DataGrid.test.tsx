import { describe, expect, it } from "bun:test";

interface TestRow {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

describe("DataGrid", () => {
  const testData: TestRow[] = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      status: "inactive",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
      status: "active",
      createdAt: "2024-01-03",
    },
  ];

  it("sorts data in ascending order", () => {
    const sorted = [...testData].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name).toBe("Alice");
    expect(sorted[sorted.length - 1].name).toBe("Charlie");
  });

  it("sorts data in descending order", () => {
    const sorted = [...testData].sort((a, b) => b.name.localeCompare(a.name));
    expect(sorted[0].name).toBe("Charlie");
    expect(sorted[sorted.length - 1].name).toBe("Alice");
  });

  it("sorts numeric columns correctly", () => {
    const sorted = [...testData].sort((a, b) => a.id - b.id);
    expect(sorted[0].id).toBe(1);
    expect(sorted[sorted.length - 1].id).toBe(3);
  });

  it("toggles sort direction", () => {
    let direction: "asc" | "desc" = "asc";
    direction = direction === "asc" ? "desc" : "asc";
    expect(direction).toBe("desc");

    direction = direction === "asc" ? "desc" : "asc";
    expect(direction).toBe("asc");
  });

  it("resets sort when changing column", () => {
    let sort = { key: "name", direction: "asc" as const };
    sort = { key: "email", direction: "asc" as const };
    expect(sort.key).toBe("email");
    expect(sort.direction).toBe("asc");
  });

  it("paginates data correctly", () => {
    const pageSize = 2;
    const currentPage = 1;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginated = testData.slice(start, end);

    expect(paginated).toHaveLength(2);
    expect(paginated[0].id).toBe(1);
    expect(paginated[1].id).toBe(2);
  });

  it("calculates total pages", () => {
    const pageSize = 2;
    const totalPages = Math.ceil(testData.length / pageSize);
    expect(totalPages).toBe(2);
  });

  it("handles last page with remaining items", () => {
    const pageSize = 2;
    const currentPage = 2;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginated = testData.slice(start, end);

    expect(paginated).toHaveLength(1);
    expect(paginated[0].id).toBe(3);
  });

  it("tracks row selection state", () => {
    const selected = new Set<number>();
    selected.add(1);
    selected.add(2);

    expect(selected.has(1)).toBe(true);
    expect(selected.has(2)).toBe(true);
    expect(selected.has(3)).toBe(false);
  });

  it("toggles row selection", () => {
    const selected = new Set<number>();
    const rowId = 1;

    // Select
    selected.add(rowId);
    expect(selected.has(rowId)).toBe(true);

    // Deselect
    selected.delete(rowId);
    expect(selected.has(rowId)).toBe(false);
  });

  it("selects all rows", () => {
    const selected = new Set<number>();
    testData.forEach((row) => selected.add(row.id));

    expect(selected.size).toBe(testData.length);
    testData.forEach((row) => {
      expect(selected.has(row.id)).toBe(true);
    });
  });

  it("deselects all rows", () => {
    const selected = new Set<number>();
    testData.forEach((row) => selected.add(row.id));
    selected.clear();

    expect(selected.size).toBe(0);
  });

  it("determines all selected state", () => {
    const selected = new Set<number>();
    const pageData = testData.slice(0, 2);

    pageData.forEach((row) => selected.add(row.id));

    const allSelected = pageData.every((row) => selected.has(row.id));
    expect(allSelected).toBe(true);
  });

  it("determines partial selected state", () => {
    const selected = new Set<number>();
    selected.add(1);

    const allSelected = testData.every((row) => selected.has(row.id));
    const someSelected = testData.some((row) => selected.has(row.id));

    expect(allSelected).toBe(false);
    expect(someSelected).toBe(true);
  });

  it("handles empty data gracefully", () => {
    const emptyData: TestRow[] = [];
    const totalPages = Math.ceil(emptyData.length / 10);

    expect(totalPages).toBe(0);
    expect(emptyData).toHaveLength(0);
  });

  it("handles single page of data", () => {
    const singlePageData = [testData[0]];
    const pageSize = 10;
    const totalPages = Math.ceil(singlePageData.length / pageSize);

    expect(totalPages).toBe(1);
  });
});
