module.exports = RowUser;
require('./style.less');
const React = require('react');
const MyRow = require('../MyRow');

function RowUser(props) {
    let idx = props.idx + 1;
    return (
        <MyRow className="RowUser" onClick={props.onClick || null}
               cells={
                   [
                       isNaN(idx) ? "" : idx,
                       props.item.username,
                       props.item.email,
                       props.item.status,
                       props.item.role,
                       props.item.fullname,
                       props.item.idCompany
                   ]
               }
               colWidths={props.colWidths}
               onColWidthChanged={props.onColWidthChanged}
               selected={props.selected}
               isHeader={props.isHeader}
               onCellClicked={props.onCellClicked}
        />
    )
}