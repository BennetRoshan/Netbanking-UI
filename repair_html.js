const fs = require('fs');

const path = 'features/transfers/manage-beneficiaries.html';
let content = fs.readFileSync(path, 'utf-8');

const brokenHTML = `                                            <td>Arjun Mehta</td>
                                            <td>500100010001</td>
                        </div>
                        </div>
            </div>`;

const fixedHTML = `                                            <td>Arjun Mehta</td>
                                            <td>500100010001</td>
                                            <td>NEXB00001</td>
                                            <td>
                                                <span class="status-badge status-active d-inline-block text-center w-75">Active</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
            </div>`;

content = content.replace(brokenHTML, fixedHTML);
fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed broken HTML in manage-beneficiaries.html');
