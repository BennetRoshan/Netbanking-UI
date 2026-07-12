const fs = require('fs');

const path = 'features/transfers/manage-beneficiaries.html';
let content = fs.readFileSync(path, 'utf-8');

// Find <tbody>
const tbodyStart = content.indexOf('<tbody>');
// Find </main>
const mainEnd = content.indexOf('</main>');

if (tbodyStart !== -1 && mainEnd !== -1) {
    const newContent = content.substring(0, tbodyStart) + `<tbody>
                                        <!-- Dynamically populated -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>` + content.substring(mainEnd + 7);
    
    fs.writeFileSync(path, newContent, 'utf-8');
    console.log('Successfully repaired and cleaned manage-beneficiaries.html');
} else {
    console.log('Could not find tags');
}
