
    const apiKey = 'AIzaSyDhq9VxlfAXVW0ryxCJ_PJn9YCeW7WMazM';
    const spreadsheetId = '1CAHCnDLIeUV9UwhsgBAaGj_4sIZC-zx1Yub_jRwdirk';  
    let sheetName = "Player Stats";
    const range = 'A1:Z100';

    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;

	function updateURL(){
		url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;
	}

    async function fetchSheetData(sheet) {

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
    }

function sortTable(columnIndex) {
            const table = document.querySelector('table');
            const rowsArray = Array.from(table.rows).slice(0);
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


    fetchSheetData();



    
