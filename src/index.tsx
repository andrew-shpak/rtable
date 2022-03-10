import * as React from 'react';
import {RTableProps} from './types';


export default function RTable(props: RTableProps) {
    const {
        rows,
        columns,
        getRowId = (row: { [key: string]: any }) => row.id,
        classNames,
        actions,
        pagination,
        toolbar = {},
        selection = {
            visible: true,
        },
    } = props;
    const {
        showFiltersButton = true,
        showColumnsButton = true,
        search = {placeholder: "Enter text"}
    } = toolbar;

    const headerScroll = React.useRef<HTMLDivElement>(null);
    const bodyScroll = React.useRef<HTMLDivElement>(null);

    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(columns.map(f => f.key));
    const [checked, setChecked] = React.useState<string[]>([]);
    const allIds = React.useMemo(() => rows.map((row: any) => getRowId(row)), []);

    return (
        <div className={classNames?.table ?? ''}>
            <div className={toolbar?.className ?? ''} style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <div style={{flex: "1 0 0"}}>
                    {props.toolbar && (<>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                        }}>
                            <button style={{
                                marginRight: "1rem"
                            }} onClick={() => {
                                actions?.add?.onClick();
                            }}>
                                Додати
                            </button>
                            <button style={{
                                marginRight: "1rem"
                            }}>
                                Видалити
                            </button>
                            {showColumnsButton && <button style={{
                                marginRight: "1rem"
                            }}>
                                Колонки
                            </button>}
                            {showFiltersButton && <button style={{
                                marginRight: "1rem"
                            }}>
                                Фільтри
                            </button>}
                        </div>
                    </>)}
                </div>
                <div style={{width: '20%'}}>
                    <input placeholder={search?.placeholder} className={selection?.className ?? ''}/>
                </div>
            </div>
            <div
                style={{
                    overflowY: 'auto',
                }}
                className={classNames?.header ?? ''}
                ref={headerScroll}
                onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
                    if (bodyScroll?.current) bodyScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
                }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    {selection?.visible && <div style={{
                        flex: `0 0  auto`,
                    }}>
                        <input
                            ref={input => {
                                if (input) {
                                    input.indeterminate = checked.length > 0 && checked.length !== rows.length;
                                }
                            }}
                            checked={checked.length === rows.length}
                            onChange={() => {
                                if (checked.length === rows.length) setChecked([]);
                                else setChecked(allIds);
                            }}
                            type="checkbox"
                        />
                    </div>}
                    {columns.map((column, columnIndex) => {
                        if (!visibleColumns.includes(column.key)) return null;
                        const flex = `${column.flex ?? 0} 0 ${column.width ?? 'auto'}`;
                        return (<div
                            style={{
                                flex,
                            }}
                            key={`${column.key}_${columnIndex}`}
                            className={`${column?.className ?? ''} ${classNames?.column ?? ''}`}
                        >{column.title}</div>)
                    })}
                    {(actions?.add?.content || actions?.edit?.content || actions?.copy?.content || actions?.remove?.content) && (
                        <div
                            onClick={() => {
                                actions?.add?.onClick();
                            }}
                            style={{
                                flex: `${actions?.flex ?? 0} 0 ${actions?.width ?? 'auto'}`,
                            }}
                            className={actions?.className ?? ''}
                        >
                            {actions?.add?.content}
                        </div>
                    )}
                </div>
            </div>
            <div
                className={classNames?.body ?? ''}
                style={{
                    overflowY: 'auto',
                }}
                ref={bodyScroll}
                onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
                    if (headerScroll?.current) headerScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
                }}>
                {rows.map((row: any, rowIndex) => {
                    const key = allIds[rowIndex];
                    const rowChecked = checked.includes(key);
                    return (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                        }} key={key}>
                            {selection?.visible && <div
                                style={{
                                    flex: `0 0  auto`,
                                }}>
                                <input
                                    className={selection?.className}
                                    checked={rowChecked}
                                    onChange={() => {
                                        if (rowChecked) {
                                            setChecked(checked.filter(f => f !== key))
                                        } else {
                                            setChecked([...checked, key])
                                        }
                                    }}
                                    type="checkbox"
                                />
                            </div>}
                            {columns.map((column) => {
                                if (!visibleColumns.includes(column.key)) return null;
                                const flex = `${column.flex ?? 0} 0 ${column.width ?? 'auto'}`;
                                const title = row[column.key];
                                return (<div
                                    style={{
                                        flex,
                                    }}
                                    key={`${column.key}_${key}`}
                                    className={`${column?.className ?? ''} ${classNames?.column ?? ''}`}
                                >{title}</div>)
                            })}
                            {actions?.copy && (
                                <>
                                    <div key={key}
                                         style={{
                                             flex: `${actions?.flex ?? 0} 0 ${actions?.width ?? ''}`,
                                         }}
                                         className={actions?.className ?? ''}
                                         onClick={() => {
                                             actions?.copy?.onClick(row);
                                         }}>{actions?.copy.content}</div>
                                </>
                            )}
                            {actions?.edit && (
                                <>
                                    <div key={key}
                                         style={{
                                             flex: `${actions?.flex ?? 0} 0 ${actions?.width ?? ''}`,
                                         }}
                                         className={actions?.className ?? ''}
                                         onClick={() => {
                                             actions?.edit?.onClick(row);
                                         }}>{actions?.edit.content}</div>
                                </>
                            )}
                            {actions?.remove && (
                                <>
                                    <div key={key}
                                         style={{
                                             flex: `${actions?.flex ?? 0} 0 ${actions?.width ?? ''}`,
                                         }}
                                         className={actions?.className ?? ''}
                                         onClick={() => {
                                             actions?.remove?.onClick(row);
                                         }}>{actions?.remove.content}</div>
                                </>
                            )}
                            {actions?.customActions}
                        </div>
                    )
                })}
            </div>
            <div
                style={{
                    width: '100%',
                    display: "inline-flex",
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}
            >
                <select>
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                </select>
                <input placeholder={"Enter page number"} style={{
                    width: '10%'
                }}/>
                <span>1-1 of 1</span>
                <div>
                    {pagination?.previousPage ? pagination?.previousPage :
                        <svg className={pagination?.previousPageClassName ?? ''} width="15" height="15"
                             viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1 7.5C1 7.66148 1.07798 7.81301 1.20938 7.90687L8.20938 12.9069C8.36179 13.0157 8.56226 13.0303 8.72879 12.9446C8.89533 12.8589 9 12.6873 9 12.5L9 10L11.5 10C11.7761 10 12 9.77614 12 9.5L12 5.5C12 5.22386 11.7761 5 11.5 5L9 5L9 2.5C9 2.31271 8.89533 2.14112 8.72879 2.05542C8.56226 1.96972 8.36179 1.98427 8.20938 2.09313L1.20938 7.09314C1.07798 7.18699 1 7.33853 1 7.5ZM8 3.4716L8 5.5C8 5.77614 8.22386 6 8.5 6L11 6L11 9L8.5 9C8.22386 9 8 9.22386 8 9.5L8 11.5284L2.36023 7.5L8 3.4716Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>}
                </div>
                <div>
                    {pagination?.nextPage ? pagination?.nextPage :
                        <svg className={pagination?.nextPageClassName ?? ''} width="15" height="15" viewBox="0 0 15 15"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14 7.5C14 7.66148 13.922 7.81301 13.7906 7.90687L6.79062 12.9069C6.63821 13.0157 6.43774 13.0303 6.27121 12.9446C6.10467 12.8589 6 12.6873 6 12.5L6 10L3.5 10C3.22386 10 3 9.77614 3 9.5L3 5.5C3 5.22386 3.22386 5 3.5 5L6 5L6 2.5C6 2.31271 6.10467 2.14112 6.27121 2.05542C6.43774 1.96972 6.63821 1.98427 6.79062 2.09313L13.7906 7.09314C13.922 7.18699 14 7.33853 14 7.5ZM7 3.4716L7 5.5C7 5.77614 6.77614 6 6.5 6L4 6L4 9L6.5 9C6.77614 9 7 9.22386 7 9.5L7 11.5284L12.6398 7.5L7 3.4716Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>}
                </div>
            </div>
        </div>
    )
}
