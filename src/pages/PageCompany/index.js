module.exports = PageCompany;
require('./style.less');
const api = require("../../services/apiClient");
const React = require('react');
const { CompanyInfoModal, ConfirmationModal } = require('../../dialogs');
const ListCompany = require('../../components/ListCompany');
const { toast } = require('react-toastify');
const LeftNavigation = require('./../LeftNavigation');
const Redirect = require('react-router-dom').Redirect;
const apiUser = require('../../services/apiUser');
const UserStatus = require('../../components/UserStatus');

function PageCompany() {
    React.Component.call(this);
    this.state = {
        items: [],
        isAddingCompany: false,
        isEditingCompany: false,
        filter: ""
    };
    this.componentDidMount = function () {
        listCompany.call(this);
        this.props.resetFilter();
    }
    this.startAddCompany = startAddCompany.bind(this);

    function startAddCompany(selectedCompany) {
        this.setState({
            isAddingCompany: true
        });
    }


    this.getItemList = function () {
        if (this.state.filter == "") return this.state.items;
        return this.state.items.filter((item) => {
            return JSON.stringify(item).toLowerCase().includes(this.state.filter.toLowerCase());
        });
    }

    this.addCompany = addCompany.bind(this);

    function addCompany(company) {
        api.addCompanyPromise(company).then(company => {
            toast(`Company ${company.name} is created`, { type: 'info' });
            this.setState(state => {
                state.items.push(company);
                return {
                    items: state.items,
                    isAddingCompany: false
                }
            });
        }).catch(error => console.error(error));
    }

    this.startDeleteCompany = startDeleteCompany.bind(this);

    function startDeleteCompany(selectedCompany) {
        this.setState({
            isDeletingCompany: true,
            selectedCompany: selectedCompany
        });
    }

    this.deleteCompany = deleteCompany.bind(this);

    function deleteCompany(selectedCompany) {
        console.log("delete company", selectedCompany);
        api.deleteCompanyPromise(selectedCompany.idCompany).then((deletedCompany) => {
            toast(`Company ${deletedCompany.name} is deleted`, { type: 'info' });
            this.setState(state => {
                let companies = state.items;
                let idx = companies.findIndex(c => c.idCompany === deletedCompany.idCompany);
                companies.splice(idx, 1);
                return {
                    items: companies,
                    isDeletingCompany: false
                }
            });
        }).catch(e => console.error(e));
    }

    function listCompany(selectedCompany) {
        api.getCompaniesPromise().then((companies) => {
            this.setState({ items: companies })
        }).catch();
    }

    this.startEditCompany = startEditCompany.bind(this);

    function startEditCompany(selectedCompany) {
        this.setState({
            isEditingCompany: true,
            selectedCompany: selectedCompany
        });
    }

    this.editCompany = editCompany.bind(this);

    function editCompany(company) {
        api.editCompanyPromise(company).then(company => {
            toast(<span>Company <strong
                style={{ color: 'yellow' }}>{company.name}</strong> is updated</span>, { type: 'info' });
            this.setState(state => {
                let idx = state.items.findIndex(c => c.idCompany === company.idCompany);
                state.items.splice(idx, 1, company);
                return {
                    items: state.items,
                    isEditingCompany: false
                }
            });
        }).catch(e => console.error(e))
    }

    this.render = function () {
        if (!apiUser.isLoggedIn()) return <Redirect to={{pathname:"/login", from:"/company"}} />;
        return (
            <div className={"PageCompany"} style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <LeftNavigation routes={
                    [

                        { path: "/user", label: "User" },
                        { path: "/group", label: "Group" },
                        { path: "/company", label: "Company" },
                        { path: "/project", label: "Project" },
                        { path: '/license-package', label: "License Package" }
                    ]
                } />
                <div style={{width: 'calc(100vw - 102px)', display: 'flex', flexDirection: 'column'}}>
                    <div className={"top-bar"}>
                        <div className={"search-box"}>
                            <div style={{ marginRight: '10px', color: '#000' }} className={"ti ti-search"} />
                            <input placeholder="Filter" value={this.state.filter} onChange={(e) => {
                                this.setState({ filter: e.target.value });
                            }} />
                        </div>
                        {/* <div className={"name"}>{localStorage.getItem('username') || "Guest"}/{localStorage.getItem('company') || "I2G"}</div>
                        <div className={"logout-btn"}>Logout</div>
                        <div className={"user-picture"} /> */}
                        <UserStatus />
                    </div>

                    <ListCompany itemPerPage={10} actions={[{
                        name: "Add", handler: startAddCompany.bind(this), show: true
                    }, {
                        name: "Delete", handler: this.startDeleteCompany, show: true
                    }, {
                        name: "Edit", handler: this.startEditCompany, show: true
                    }, {
                        name: "Refresh", handler: listCompany.bind(this), show: true
                    }]} items={this.getItemList()} />
                    <CompanyInfoModal isOpen={this.state.isAddingCompany}
                        onOk={this.addCompany} onCancel={(e) => this.setState({ isAddingCompany: false })} />
                    <CompanyInfoModal isOpen={this.state.isEditingCompany} company={this.state.selectedCompany}
                        onOk={this.editCompany} onCancel={(e) => this.setState({ isEditingCompany: false })} />
                    <ConfirmationModal isOpen={this.state.isDeletingCompany} title="Confirmation"
                        message="Are you sure to delete selected company?"
                        onCancel={() => this.setState({ isDeletingCompany: false })}
                        onOk={() => this.deleteCompany(this.state.selectedCompany)} />
                </div>
            </div>
        );
    }
}

PageCompany.prototype = Object.create(React.Component.prototype);
