import * as React from "react";

export type RTableModel = { [name: string]: any };

export type RTableColumnProps<RTableModel> = {
    key: NonNullable<string>
    title?: React.ReactNode;
    visible?: boolean;
    width?: string;
    flex?: number
    className?: string
    hint?: string
}

export type RTableProps<> = {
    rows: NonNullable<ReadonlyArray<RTableModel>>
    columns: NonNullable<ReadonlyArray<RTableColumnProps<RTableModel>>>
    getRowId?: (row: RTableModel) => string | number
    classNames?: {
        table?: string;
        column?: string
        header?: string
        body?: string
    }
    actions?: {
        width?: string;
        flex?: number
        className?: string
        copy?: {
            content: React.ReactNode,
            onClick: (row: RTableModel) => void,
        },
        remove?: {
            content: React.ReactNode,
            onClick: (row: RTableModel) => void,
        },
        edit?: {
            content: React.ReactNode,
            onClick: (row: RTableModel) => void,
        }
        add?: {
            content: React.ReactNode,
            onClick: () => void,
        }
        customActions?: React.ReactNode
    }
    pagination?: {
        count?: number
        page?: number
        rowsPerPage: number[]
        previousPage?: React.ReactNode
        nextPage?: React.ReactNode
        previousPageClassName?: string
        nextPageClassName?: string
    },
    toolbar?: {
        className?: string,
        filtersButtonClassName?: string,
        columnsButtonClassName?: string,
        showFiltersButton?: boolean
        showColumnsButton?: boolean
        add?: {
            content: React.ReactNode,
            className?: string
            onClick: () => void,
        },
        remove?: {
            content: React.ReactNode,
            className?: string
            onClick: () => void,
        },
        search?: {
            placeholder?: string
        }
    },
    selection?: {
        visible?: boolean
        className?: string
    }
}
