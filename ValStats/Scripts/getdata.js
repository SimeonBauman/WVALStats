const apiKey = 'AIzaSyDhq9VxlfAXVW0ryxCJ_PJn9YCeW7WMazM';
    const spreadsheetId = '1CAHCnDLIeUV9UwhsgBAaGj_4sIZC-zx1Yub_jRwdirk';  
    let sheetName = "";
    const range = 'A1:Z100';

    let url = https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey};

	function updateURL(){
		url = https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey};
	}

    async function fetchSheetData(sheet) {
	sheetName = sheet;
	updateURL();
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.values) {
          populateTable(data.values);
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
      values[0].forEach((header, index) => {
                const th = document.createElement('th');
                th.textContent = header;
                th.addEventListener('click', () => sortTable(index));
                headerRow.appendChild(th);
      });

// Populate table rows
      for (let i = 1; i < values.length; i++) {
        const tr = document.createElement('tr');
        values[i].forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
	  
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      }

function sortTable(columnIndex) {
            const table = document.querySelector('table');
            const rowsArray = Array.from(table.rows).slice(0);
            const isAscending = table.dataset.sortOrder === 'asc';
	rowsArray.sort((rowA, rowB) => {Add commentMore actions
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
    const url = https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey};

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.sheets) {
            console.log("Available Sheets:");
            data.sheets.forEach((sheet, index) => {
                const btn = document.createElement("button");
                btn.innerText = sheet.properties.title;

                btn.onclick = () => fetchSheetData(sheet.properties.title);
                const container = document.getElementById("buttonContainer");
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
});
listSheets();
