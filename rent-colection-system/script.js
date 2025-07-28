let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
let payments = JSON.parse(localStorage.getItem('payments')) || [];

const tenantForm = document.getElementById('tenantForm');
const tenantTable = document.getElementById('tenantTable').querySelector('tbody');
const tenantSelect = document.getElementById('tenantSelect');
const paymentForm = document.getElementById('paymentForm');
const totalCollectedEl = document.getElementById('totalCollected');
const totalOutstandingEl = document.getElementById('totalOutstanding');

function saveData() {
  localStorage.setItem('tenants', JSON.stringify(tenants));
  localStorage.setItem('payments', JSON.stringify(payments));
}

function renderTenants() {
  tenantTable.innerHTML = '';
  tenantSelect.innerHTML = '';
  tenants.forEach((t, index) => {
    const paid = payments.filter(p => p.tenant === t.name).reduce((sum, p) => sum + p.amount, 0);
    const status = paid >= t.rent ? 'Paid' : 'Pending';
    tenantTable.innerHTML += `<tr>
      <td>${t.name}</td>
      <td>${t.unit}</td>
      <td>${t.rent}</td>
      <td>${status}</td>
      <td><button onclick="deleteTenant(${index})">Delete</button></td>
    </tr>`;
    tenantSelect.innerHTML += `<option value="${t.name}">${t.name}</option>`;
  });
  updateReport();
}

function updateReport() {
  const totalRent = tenants.reduce((sum, t) => sum + t.rent, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  totalCollectedEl.textContent = totalPaid;
  totalOutstandingEl.textContent = totalRent - totalPaid;
}

tenantForm.addEventListener('submit', e => {
  e.preventDefault();
  const newTenant = {
    name: document.getElementById('tenantName').value,
    unit: document.getElementById('unitNumber').value,
    rent: parseFloat(document.getElementById('monthlyRent').value),
    contact: document.getElementById('contact').value
  };
  tenants.push(newTenant);
  saveData();
  renderTenants();
  tenantForm.reset();
});

paymentForm.addEventListener('submit', e => {
  e.preventDefault();
  const payment = {
    tenant: tenantSelect.value,
    amount: parseFloat(document.getElementById('paymentAmount').value),
    date: document.getElementById('paymentDate').value
  };
  payments.push(payment);
  saveData();
  renderTenants();
  paymentForm.reset();
});

function deleteTenant(index) {
  tenants.splice(index, 1);
  saveData();
  renderTenants();
}

renderTenants();
