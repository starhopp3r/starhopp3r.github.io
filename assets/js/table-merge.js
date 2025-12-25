(() => {
  const isEmptyCell = (cell) => {
    if (!cell) {
      return true;
    }

    const text = cell.textContent.replace(/\u00a0/g, " ").trim();
    if (text.length > 0) {
      return false;
    }

    if (cell.children.length === 0) {
      return true;
    }

    return !Array.from(cell.children).some((child) => {
      if (child.tagName === "BR") {
        return false;
      }

      if (child.tagName === "IMG") {
        return true;
      }

      return child.textContent.replace(/\u00a0/g, " ").trim().length > 0;
    });
  };

  const buildGrid = (rows) => {
    const grid = [];

    rows.forEach((row, rowIndex) => {
      let colIndex = 0;

      grid[rowIndex] = grid[rowIndex] || [];

      Array.from(row.cells).forEach((cell) => {
        while (grid[rowIndex][colIndex]) {
          colIndex += 1;
        }

        const rowSpan = cell.rowSpan || 1;
        const colSpan = cell.colSpan || 1;

        for (let r = 0; r < rowSpan; r += 1) {
          for (let c = 0; c < colSpan; c += 1) {
            if (!grid[rowIndex + r]) {
              grid[rowIndex + r] = [];
            }
            grid[rowIndex + r][colIndex + c] = cell;
          }
        }

        colIndex += colSpan;
      });
    });

    return grid;
  };

  const mergeTable = (table) => {
    const tbody = table.tBodies.length ? table.tBodies[0] : null;
    const rows = tbody ? Array.from(tbody.rows) : Array.from(table.rows);

    if (rows.length === 0) {
      return;
    }

    const grid = buildGrid(rows);
    const toRemove = new Set();

    for (let rowIndex = 1; rowIndex < grid.length; rowIndex += 1) {
      const row = grid[rowIndex] || [];

      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        if (!cell || toRemove.has(cell) || !isEmptyCell(cell)) {
          continue;
        }

        let scanRow = rowIndex - 1;
        while (scanRow >= 0) {
          const above = grid[scanRow] ? grid[scanRow][colIndex] : null;
          if (!above) {
            scanRow -= 1;
            continue;
          }
          if (toRemove.has(above) || isEmptyCell(above)) {
            scanRow -= 1;
            continue;
          }

          above.rowSpan = (above.rowSpan || 1) + 1;
          toRemove.add(cell);
          break;
        }
      }
    }

    for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 1) {
      const row = grid[rowIndex] || [];

      for (let colIndex = 1; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        if (!cell || toRemove.has(cell) || !isEmptyCell(cell)) {
          continue;
        }

        let scanCol = colIndex - 1;
        while (scanCol >= 0) {
          const left = row[scanCol];
          if (!left) {
            scanCol -= 1;
            continue;
          }
          if (toRemove.has(left) || isEmptyCell(left)) {
            scanCol -= 1;
            continue;
          }

          left.colSpan = (left.colSpan || 1) + 1;
          toRemove.add(cell);
          break;
        }
      }
    }

    toRemove.forEach((cell) => {
      if (cell.parentNode) {
        cell.parentNode.removeChild(cell);
      }
    });
  };

  const wrapTable = (table) => {
    const parent = table.parentElement;
    if (parent && parent.classList.contains("table-wrap")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrap";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  };

  const run = () => {
    document.querySelectorAll(".post-body table").forEach((table) => {
      wrapTable(table);
      mergeTable(table);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
