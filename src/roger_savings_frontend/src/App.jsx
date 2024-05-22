import React, { useState, useEffect } from 'react';
import { roger_savings_backend } from 'declarations/roger_savings_backend';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [allaccounts, setAllaccounts] = useState([]);
  const [savemessage, setSavemessage] = useState('');
  const [editAccount, setEditAccount] = useState(null);
  const [editing, setEditing] = useState(false); // New state to control edit form visibility
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  function loadAccounts() {
    setProcessing(true); 
    roger_savings_backend.getUserAccounts().then((accounts) => {
      setAllaccounts(accounts);
    }).catch((error) => {
      console.error('Error loading accounts', error);
    }).finally(() => {
      setProcessing(false); 
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const userUsername = event.target.elements.userUsername.value;
    const userPassword = event.target.elements.userPassword.value;
    const userRole = event.target.elements.userRole.value;
    const userTel = event.target.elements.userTel.value;

    setProcessing(true); // Start processing

    roger_savings_backend.addUserAccount(userUsername, userPassword, userRole, userTel).then((savemessage) => {
      setSavemessage(savemessage);
      loadAccounts();
    }).finally(() => {
      setProcessing(false); // End processing
    });
  }

  function handleRemoveaccount(accountId) {
    setProcessing(true); // Start processing

    roger_savings_backend.deleteUserAccount(accountId).then(() => {
      loadAccounts();
    }).finally(() => {
      setProcessing(false); // End processing
    });
  }

  function handleUpdate(event) {
    event.preventDefault();
    const id = parseInt(event.target.elements.id.value, 10);
    const userUsername = event.target.elements.userUsername.value;
    const userPassword = event.target.elements.userPassword.value;
    const userRole = event.target.elements.userRole.value;
    const userTel = event.target.elements.userTel.value;

    setProcessing(true); // Start processing

    roger_savings_backend.updateUserAccount(id, userUsername, userPassword, userRole, userTel).then((savemessage) => {
      setSavemessage(savemessage);
      loadAccounts();
      setEditing(false); // Close edit form after updating
    }).finally(() => {
      setProcessing(false); // End processing
    });
  }

  function handleEdit(account) {
    setEditAccount(account);
    setEditing(true); // Open edit form
  }

  return (
    <div className="container">
      <h1 className="mt-5">Savings App</h1>
      
      {processing && (
        <div className="overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="overlay-message">Processing, Please wait...</div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Add New Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="userUsername" className="form-label">Username</label>
                <input id="userUsername" className="form-control" type="text" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="userRole" className="form-label">User Role</label>
                <input id="userRole" className="form-control" type="text" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="userTel" className="form-label">User Tel</label>
                <input id="userTel" className="form-control" type="text" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="userPassword" className="form-label">User Password</label>
                <input id="userPassword" className="form-control" type="password" required />
              </div>
            </div>
            <button className="btn btn-primary mt-3" type="submit">Save</button>
          </form>
        </div>
      </div>
      
      <section id="savemessage" className={`alert ${savemessage ? 'alert-info' : ''}`}>{savemessage}</section>
      
      <div className="row">
        <center><h1>All Accounts</h1></center>
        {allaccounts.map((account) => (
          <div className="col-md-4 mb-4" key={account.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">User ID: {String(account.id)}</h5>
                <p className="card-text">Username: {account.userUsername}</p>
                <p className="card-text">Role: {account.userRole}</p>
                <p className="card-text">Tel: {account.userTel}</p>
                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(account)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveaccount(account.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {editing && editAccount && (
        <div className="card mt-5">
          <div className="card-body">
            <h2 className="card-title">Update Account</h2>
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="id">User ID</label>
                  <input id="id" className="form-control" type="text" defaultValue={String(editAccount.id)} readOnly />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userUsername">Username</label>
                  <input id="userUsername" className="form-control" type="text" defaultValue={editAccount.userUsername} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userRole">User Role</label>
                  <input id="userRole" className="form-control" type="text" defaultValue={editAccount.userRole} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userTel">User Tel</label>
                  <input id="userTel" className="form-control" type="text" defaultValue={editAccount.userTel} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userPassword">User Password</label>
                  <input id="userPassword" className="form-control" type="password" defaultValue={editAccount.userPassword} required />
                </div>
              </div>
              <button className="btn btn-primary mt-3" type="submit">Update</button>
              <button className="btn btn-secondary mt-3 ml-2" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-5 text-center">
        <p>Made with ❤️ by Roger</p>
      </footer>
    </div>
  );
}

export default App;
