import 'react-app-polyfill/ie11';
import * as React from 'react';
import RTable from '../src';
import Tooltip from '@reach/tooltip';
import Portal from '@reach/portal';
import ReactDOM from 'react-dom';
import {Dialog} from "@reach/dialog";
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/tooltip/styles.css';
import '@reach/dialog/styles.css';

const App = () => {
    const [data, setData] = React.useState([
        {name: 'name1', id: 'name1', lastName: "l1"},
        {name: 'name2', id: 'name2', lastName: "l2"},
        {name: 'name3', id: 'name3', lastName: "l3"},
    ]);
const [gridFilters, setGridFilters] = React.useState({
    name:'',
    lastName:''
});
    const columns = [
        {
            key: 'name',
            title: 'name',
            width: '1000px',
            filtered: false,
            render: (params: { value: string | number }) => {
                return (
                    <Tooltip label="Save">
                        <span>{params.value}</span>
                    </Tooltip>
                );
            },
        },
        {
            key: 'lastName',
            title: 'lastName',
            flex: 1,
            sorted: false,
        },
    ];
    const Actions =(props: {
        ids: string[];
        indexes: number[];
        clearCheckedRows: () => void;
        visibleColumns: string[]
        setVisibleColumns: (columns: string[]) => void
    }) => {
        const [showDialog, setShowDialog] = React.useState(false);
        const [filters, setFilters] = React.useState(gridFilters);
        const open = () => setShowDialog(true);
        const close = () => setShowDialog(false);
        const {ids, indexes, clearCheckedRows, visibleColumns, setVisibleColumns} = props;
        const [openColumnsDialog, setOpenColumnsDialog] = React.useState<boolean>(false);
        const nextIndex = data.length + 1;
        const columnsBtnRef = React.useRef<HTMLButtonElement>(null)
        return (
            <>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    <button
                        className={'btn btn-success'}
                        onClick={() => {
                            data.push({
                                name: nextIndex + 'name',
                                lastName: nextIndex + "lastName",
                                id: nextIndex + 'name',
                            });
                        }}
                    >
                        Add
                    </button>
                    <button
                        className={'btn btn-danger'}
                        disabled={ids.length === 0}
                        onClick={() => {
                            indexes.forEach((index) => data.splice(index, 1));
                            setData([...data]);
                            clearCheckedRows();
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className={'btn btn-info'}
                        ref={columnsBtnRef}
                        onClick={() => {
                            setOpenColumnsDialog((state) => !state)
                        }}
                    >
                        Columns
                    </button>
                    <button
                        className={`btn ${Object.values(gridFilters).some(x=> x.length>0)? "btn-warning":"btn-primary"}`}
                        onClick={open}
                    >
                        Filters
                    </button>
                </div>
                <Dialog isOpen={showDialog} onDismiss={close}>
                    <div style={{
                        display: 'flex',
                        alignItems:'center',
                        justifyContent:'space-between',
                        height:'20px'
                    }}>
                        <h2>Table filters</h2>
                        <button className="close-button" onClick={close}>
                            <VisuallyHidden>Close</VisuallyHidden>
                            <span aria-hidden>×</span>
                        </button>
                    </div>
                    <hr style={{
                        marginBottom:'4px',
                        marginTop:'4px',
                    }}/>
                    <div>
                        <label>Name:</label>{}
                        <input name={"name"} type="text" value={filters.name} onChange={(event)=> setFilters({
                            ...filters,
                            name:event.target.value
                        })} className="input"
                               placeholder={"Enter user name"}/>
                    </div>
                    <div>
                        <label>LastName:</label>{}
                        <input name={"lastName"} type="text" value={filters.lastName} onChange={(event)=> setFilters({
                            ...filters,
                            lastName:event.target.value
                        })} className="input"
                               placeholder={"Enter user last name"}/>
                    </div>
                    <hr style={{
                        marginBottom:'4px',
                        marginTop:'4px',
                    }}/>
                    <div style={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent:'flex-end'
                    }}>
                        <button className="btn btn-danger" onClick={close}>Close</button>
                        <button className="btn btn-success" onClick={()=>{
                            setData(data.filter((row)=> row.name.includes(filters.name)))
                            setGridFilters(filters);
                            close()
                        }}>Apply</button>
                    </div>

                </Dialog>
                {openColumnsDialog && <Portal>
                    {columnsBtnRef.current && <div
                        style={{
                            position: "absolute",
                            top: columnsBtnRef.current.offsetTop + columnsBtnRef.current.offsetHeight,
                            left: columnsBtnRef.current.offsetLeft,
                            width: 150,
                            backgroundColor: "#e5e7eb",
                            borderRadius: "4px",
                            padding: '8px',
                            marginTop: "2px",
                        }}
                    >
                        {columns.map(column => {
                            const include = visibleColumns.includes(column.key);
                            return (<div className="flex items-center" key={column.key}>
                                <input type="checkbox" checked={include}
                                       onChange={() => {
                                           if (include) {
                                               setVisibleColumns([...visibleColumns.filter(f => f !== column.key)])
                                           } else {
                                               setVisibleColumns([
                                                   ...visibleColumns,
                                                   column.key
                                               ])
                                           }
                                       }}
                                />
                                {' '}<label className="pl-2">{column.title}</label>
                            </div>)
                        })}

                    </div>}
                </Portal>}

            </>
        );
    };

    return (
        <div
            style={{
                padding: 20,
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <RTable
                    classNames={{
                        table: 'table',
                        column: 'column',
                        header: 'header',
                        body: 'body',
                        row: 'row',
                    }}
                    selection={{
                        checkbox: 'checkbox',
                    }}
                    pagination={{
                        previousPageClassName: 'btn-icon',
                        nextPageClassName: 'btn-icon',
                        of: 'з',
                    }}
                    toolbar={{
                        visible: true,
                        className: 'toolbar',
                        search: {
                            placeholder: 'Введіть текст',
                            className: 'search',
                        },
                        actions: (params) => (
                            <Actions
                                {...params}
                                indexes={params.ids.map((f) =>
                                    data.findIndex((x) => x.id.toString() === f)
                                )}
                            />
                        ),
                    }}
                    rows={data}
                    height={'70vh'}
                    columns={columns}
                    extend={{
                        className: 'extended',
                        render: ({row, rowIndex}) => {
                            if (row.id === 1) return null;
                            return '1';
                        },
                    }}
                    filters={{
                        onClick: () => {
                        },
                        isActive: () => true,
                    }}
                />
            </div>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
