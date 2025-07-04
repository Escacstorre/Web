
    class Excel {
        constructor(content) {
            this.content = content;
        }

        header() {
            return this.content[4].map(cell => cell || '');
        }

        rows() {
            return new RowCollection(this.content.slice(4, this.content.length - 3));
        }
    }

    class RowCollection {
        constructor(rows) {
            this.rows = rows;
        }

        first() {
            return new Row(this.rows[1]);
        }

        get(index) {
            return new Row(this.rows[index]);
        }

        count() {
            return this.rows.length;
        }
    }

    class Row {
        constructor(row) {
            this.row = row;
        }

        Núm() {
            return this.row[0] || '';
        }

        _() {
            return this.row[1] || '';
        }

        Nom() {
            return this.row[2] || '';
        }

        ID() {
            return this.row[3] || '';
        }

        FideID() {
            return this.row[4] || '';
        }

        FED() {
            return this.row[5] || '';
        }

        Elo() {
            return this.row[6] || '';
        }

        FIDE() {
            return this.row[7] || '';
        }

        Gr() {
            return this.row[8] || '';
        }

        Club_Ciutat() {
            return this.row[9] || '';
        }
    }

    class ExcelPrinter {
        static print(tableId, excel) {
            const table = document.getElementById(tableId);
            excel.header().forEach(title => {
                table.querySelector("thead>tr").innerHTML += `<td>${title}</td>`;
            });

            for (let index = 1; index < excel.rows().count(); index++) {
                const row = excel.rows().get(index);
                table.querySelector('tbody').innerHTML += `
                    <tr>
                        <td>${row.Núm()}</td>
                        <td>${row._()}</td>
                        <td>${row.Nom()}</td>
                        <td>${row.ID()}</td>
                        <td>${row.FideID()}</td>
                        <td>${row.FED()}</td>
                        <td>${row.Elo()}</td>
                        <td>${row.FIDE()}</td>
                        <td>${row.Gr()}</td>
                        <td>${row.Club_Ciutat()}</td>
                    </tr>
                `;
            }
        }
    }

async function fetchExcel(url) {
    const proxyUrl = 'https://api.allorigins.win/raw?url='; // URL del proxy
    try {
        // Construir la URL del proxy
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return readXlsxFile(blob);
    } catch (error) {
        console.error('Error fetching the Excel file:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const url = 'https://chess-results.com/tnr979564.aspx?lan=9&zeilen=0&art=1&rd=8&prt=4&excel=2010';
    try {
        const content = await fetchExcel(url);
        if (content) {
            const excel = new Excel(content);
            ExcelPrinter.print('excel-table', excel);
        } else {
            console.error('Failed to load Excel content.');
        }
    } catch (error) {
        console.error('Error processing the Excel file:', error);
    }
});