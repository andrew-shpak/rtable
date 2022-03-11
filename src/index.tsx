import * as React from 'react';
import {RTableProps} from './types';

export default function RTable(props: RTableProps) {
    const {
        rows,
        columns,
        getRowId = (row: { [key: string]: any }) => row.id,
        classNames,
        pagination = {},
        toolbar = {visible: true},
        selection = {
            visible: true,
        },
    } = props;
    const {
        rowsPerPage = [5, 10, 20, 50, 100],
        defaultRowsPerPage = 10,
        of = 'of',
    } = pagination;

    const headerScroll = React.useRef<HTMLDivElement>(null);
    const bodyScroll = React.useRef<HTMLDivElement>(null);

    const [take, setTake] = React.useState<number>(defaultRowsPerPage);
    const [page, setPage] = React.useState<number>(0);
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
        columns.map((f) => f.key)
    );
    const [checked, setChecked] = React.useState<string[]>([]);
    const allIds = React.useMemo(
        () => rows.map((row: any) => getRowId(row)),
        [rows, getRowId]
    );

    return (
        <div className={classNames?.table ?? ''}>
            <div
                className={toolbar?.className ?? ''}
                style={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <div style={{flex: '1 0 0'}}>
                    {toolbar?.actions &&
                        toolbar?.actions({
                            ids: checked,
                        })}
                </div>
                <div style={{width: '20%'}}>
                    <input
                        placeholder={toolbar?.search?.placeholder ?? 'Enter text'}
                        className={toolbar?.search?.className ?? ''}
                        type={'search'}
                    />
                </div>
            </div>
            <div
                style={{
                    overflowY: 'auto',
                }}
                className={classNames?.header ?? ''}
                ref={headerScroll}
                onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
                    if (bodyScroll?.current)
                        bodyScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {(selection?.visible || selection.checkbox) && (
                        <div
                            style={{
                                flex: `0 0  auto`,
                            }}
                            className={classNames?.column ?? ''}
                        >
                            <input
                                className={selection?.checkbox ?? ''}
                                ref={(input) => {
                                    if (input) {
                                        input.indeterminate =
                                            checked.length > 0 && checked.length !== rows.length;
                                    }
                                }}
                                checked={checked.length === rows.length}
                                onChange={() => {
                                    if (checked.length === rows.length) setChecked([]);
                                    else setChecked(allIds);
                                }}
                                type="checkbox"
                            />
                        </div>
                    )}
                    {columns.map((column, columnIndex) => {
                        if (!visibleColumns.includes(column.key)) return null;
                        const flex = `${column.flex ?? 0} 0 ${column.width ?? 'auto'}`;
                        return (
                            <div
                                style={{
                                    flex,
                                    textAlign: column.type === "number" ? "right" : "left"
                                }}
                                key={`${column.key}_${columnIndex}`}
                                className={`${column?.className ?? ''} ${
                                    classNames?.column ?? ''
                                }`}
                            >
                                {column.title}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div
                className={classNames?.body ?? ''}
                style={{
                    overflowY: 'auto',
                }}
                ref={bodyScroll}
                onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
                    if (headerScroll?.current)
                        headerScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
                }}
            >
                {rows.map((row: any, rowIndex) => {
                    const key = allIds[rowIndex];
                    const rowChecked = checked.includes(key);
                    return (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            className={classNames?.row ?? ''}
                            key={key}
                        >
                            {(selection?.visible || selection.checkbox) && (
                                <div
                                    style={{
                                        flex: `0 0  auto`,
                                    }}
                                    className={classNames?.column ?? ''}
                                >
                                    <input
                                        className={selection?.checkbox ?? ''}
                                        checked={rowChecked}
                                        onChange={() => {
                                            if (rowChecked) {
                                                setChecked(checked.filter((f) => f !== key));
                                            } else {
                                                setChecked([...checked, key]);
                                            }
                                        }}
                                        type="checkbox"
                                    />
                                </div>
                            )}
                            {columns.map((column) => {
                                if (!visibleColumns.includes(column.key)) return null;
                                const flex = `${column.flex ?? 0} 0 ${column.width ?? 'auto'}`;
                                const title = row[column.key];
                                return (
                                    <div
                                        style={{
                                            flex,
                                            textAlign: column.type === "number" ? "right" : "left"
                                        }}
                                        key={`${column.key}_${key}`}
                                        className={`${column?.className ?? ''} ${
                                            classNames?.column ?? ''
                                        }`}
                                    >
                                        {title}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div
                style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <select
                    defaultValue={take}
                    onChange={(event) => {
                        setTake(parseInt(event.target.value, 10));
                    }}
                >
                    {rowsPerPage?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <input
                    placeholder={'Enter page number'}
                    style={{
                        width: '10%',
                    }}
                />
                <span>
          {take * page + 1}-
                    {rows.length < take ? rows.length : take * page + take} {of}{' '}
                    {rows.length}
        </span>
                <div>
                    {pagination?.previousPage ? (
                        pagination?.previousPage
                    ) : (
                        <button
                            disabled={page === 0}
                            className={pagination?.previousPageClassName ?? ''}
                            onClick={() => {
                                if (page > 0) setPage((state) => state - 1);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#fcfcfc"
                                viewBox="0 0 256 256"
                            >
                                <rect width="256" height="256" fill="none"></rect>
                                <polyline
                                    points="160 208 80 128 160 48"
                                    fill="none"
                                    stroke="#fcfcfc"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="24"
                                ></polyline>
                            </svg>
                        </button>
                    )}
                </div>
                <div>
                    {pagination.nextPage ? (
                        pagination.nextPage
                    ) : (
                        <button
                            disabled={page === 0}
                            className={pagination?.nextPageClassName ?? ''}
                            onClick={() => setPage((state) => state + 1)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#fcfcfc"
                                viewBox="0 0 256 256"
                            >
                                <rect width="256" height="256" fill="none"></rect>
                                <polyline
                                    points="96 48 176 128 96 208"
                                    fill="none"
                                    stroke="#fcfcfc"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="24"
                                ></polyline>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
