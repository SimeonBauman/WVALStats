const apiKey = 'AIzaSyDhq9VxlfAXVW0ryxCJ_PJn9YCeW7WMazM';
const spreadsheetId = '1CAHCnDLIeUV9UwhsgBAaGj_4sIZC-zx1Yub_jRwdirk';
let sheetName = "";
const range = 'A1:Z100';

function rgbColorToHex(color) {
  const to255 = c => Math.round((c || 0) * 255);
  const toHex = c => to255(c).toString(16).padStart(2, '0');
  return `#${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`;
}

async function fetchSheetData(sheet) {
  sheetName = sheet;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.data.rowData.values(userEnteredValue,userEnteredFormat.backgroundColor)&includeGridData=true&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Find the sheet data matching sheetName
    const sheetData = data.sheets.find(s => s.properties.title === sheetName);
    if (!sheetData) {
      console.error(`Sheet "${sheetName}" not found`);
      return;
    }

    const gridData = sheetData.data[0].rowData;

    if (gridData) {
      const parsedValues = gridData.map(row =>
        (row.values || []).map(cell => {
          const value = cell.userEnteredValue?.stringValue ?? cell.userEnteredValue?.numberValue ?? "";
          const bgColor = cell.userEnteredFormat?.backgroundColor;
          return {
            value: value,
            color: bgColor ? rgbColorToHex(bgColor) : ""
          };
        })
      );

      populateTable(parsedValues);
    } else {
      console.error('No data found.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function populateTable(values) {
  const headerRow = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  headerRow.innerHTML = '';
  tableBody.innerHTML = '';

  // Create table header
  values[0].forEach((cell, index) => {
    const th = document.createElement('th');
    th.textContent = cell.value || '';
    if (cell.color) {
      th.style.setProperty('background-color', cell.color, 'important');
    }
    th.addEventListener('click', () => sortTable(index));
    headerRow.appendChild(th);
  });

  // Populate table rows
  for (let i = 1; i < values.length; i++) {
    const tr = document.createElement('tr');
    values[i].forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell.value || '';
      if (cell.color) {
        td.style.setProperty('background-color', cell.color, 'important');
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  }
}

function sortTable(columnIndex) {
  const table = document.querySelector('table');
  const rowsArray = Array.from(table.rows).slice(1); // skip header row
  const isAscending = table.dataset.sortOrder === 'asc';

  rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    if (isNaN(cellA) || isNaN(cellB)) {
      return isAscending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }

    return isAscending
      ? Number(cellA) - Number(cellB)
      : Number(cellB) - Number(cellA);
  });

  rowsArray.forEach(row => table.appendChild(row));
  table.dataset.sortOrder = isAscending ? 'desc' : 'asc';
}

async function listSheets() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.sheets) {
      console.log("Available Sheets:");
      const container = document.getElementById("buttonContainer");
      container.innerHTML = ''; // Clear existing buttons
      data.sheets.forEach(sheet => {
        const btn = document.createElement("button");
        btn.innerText = sheet.properties.title;

        btn.onclick = () => fetchSheetData(sheet.properties.title);
        container.appendChild(btn);
        container.appendChild(document.createElement("br"));
        btn.classList.add("button-class");
      });

      // Automatically load the first sheet
      if (data.sheets.length > 0) {
        fetchSheetData(data.sheets[0].properties.title);
      }

    } else {
      console.log("No sheets found.");
    }
  } catch (error) {
    console.error("Error fetching sheets:", error);
  }
}

document.getElementById("toggleBtn").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  sidebar.classList.toggle("hidden");
  content.classList.toggle("sidebar-hidden");
});

// Initial call
listSheets();
