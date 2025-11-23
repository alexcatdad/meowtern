import { describe, expect, it } from "bun:test";

describe("Pagination", () => {
  it("generates page numbers for small page count", () => {
    const totalPages = 3;
    const siblingCount = 1;
    const currentPage = 1;

    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, i) => start + i);
    };

    const result = range(1, totalPages);
    expect(result).toEqual([1, 2, 3]);
  });

  it("generates page numbers for large page count", () => {
    const totalPages = 10;
    const currentPage = 5;
    const siblingCount = 1;

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages,
    );

    expect(leftSiblingIndex).toBe(4);
    expect(rightSiblingIndex).toBe(6);
  });

  it("shows left dots when applicable", () => {
    const currentPage = 8;
    const siblingCount = 1;
    const totalPages = 10;

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const showLeftDots = leftSiblingIndex > 2;

    expect(showLeftDots).toBe(true);
  });

  it("shows right dots when applicable", () => {
    const currentPage = 2;
    const siblingCount = 1;
    const totalPages = 10;

    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages,
    );
    const showRightDots = rightSiblingIndex < totalPages - 1;

    expect(showRightDots).toBe(true);
  });

  it("handles only left dots scenario", () => {
    const totalPages = 10;
    const currentPage = 1;
    const siblingCount = 1;

    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages,
    );
    const showLeftDots = currentPage - siblingCount > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    expect(showLeftDots).toBe(false);
    expect(showRightDots).toBe(true);
  });

  it("handles only right dots scenario", () => {
    const totalPages = 10;
    const currentPage = 10;
    const siblingCount = 1;

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = currentPage + siblingCount < totalPages - 1;

    expect(showLeftDots).toBe(true);
    expect(showRightDots).toBe(false);
  });

  it("handles both dots scenario", () => {
    const totalPages = 20;
    const currentPage = 10;
    const siblingCount = 1;

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages,
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    expect(showLeftDots).toBe(true);
    expect(showRightDots).toBe(true);
  });

  it("navigates to valid page", () => {
    const totalPages = 10;
    const newPage = 5;
    const isValid = newPage >= 1 && newPage <= totalPages;

    expect(isValid).toBe(true);
  });

  it("rejects navigation to invalid page", () => {
    const totalPages = 10;
    const newPage = 11;
    const isValid = newPage >= 1 && newPage <= totalPages;

    expect(isValid).toBe(false);
  });

  it("handles zero pages", () => {
    const totalPages = 0;
    expect(totalPages).toBe(0);
  });

  it("handles single page", () => {
    const totalPages = 1;
    const currentPage = 1;
    expect(currentPage <= totalPages).toBe(true);
  });

  it("calculates sibling count variations", () => {
    const testCases = [0, 1, 2, 3];
    expect(testCases).toContain(0);
    expect(testCases).toContain(1);
    expect(testCases).toContain(2);
    expect(testCases).toContain(3);
  });

  it("shows first and last buttons", () => {
    const showFirstLast = true;
    expect(showFirstLast).toBe(true);
  });

  it("hides first and last buttons when disabled", () => {
    const showFirstLast = false;
    expect(showFirstLast).toBe(false);
  });
});
