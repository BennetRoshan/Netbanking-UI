const fs = require('fs');
const path = 'features/dashboard/statements.html';
let content = fs.readFileSync(path, 'utf-8');

// The multi_replace_file_content removed a big chunk. I'll restore it.
const missingChunk = `                        <button type="button" id="applyFilters" class="btn btn-filter">Apply Filters</button>
                        <button type="button" id="clearFilters" class="btn btn-filter">Clear Filters</button>
                    </div>
                </div>
                
                <!-- Data Table Section -->
                <div class="statement-card py-4" style="min-height: 400px; display: flex; flex-direction: column;">
                    <div class="table-responsive flex-grow-1">
                        <table id="statementsTable" class="table table-borderless table-statements mb-0 align-middle w-100">
                            <thead>
                                <tr>
                                    <th scope="col" style="width: 15%;">Ref ID</th>
                                    <th scope="col" style="width: 10%;">Type</th>
                                    <th scope="col" style="width: 15%;">Amount</th>
                                    <th scope="col" style="width: 15%;">Balance</th>
                                    <th scope="col" style="width: 30%;">Description</th>
                                    <th scope="col" style="width: 15%;">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    `;

content = content.replace(`                            </select>
                        </div>
                    <div class="text-center mt-4 pagination-controls">`, `                            </select>
                        </div>
` + missingChunk + `
                    <div class="text-center mt-4 pagination-controls">`);

fs.writeFileSync(path, content, 'utf-8');
