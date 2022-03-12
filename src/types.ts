import * as React from 'react';

export type RTableModel = { [name: string]: any };

export type RTableColumnProps = {
  key: NonNullable<string>;
  title?: React.ReactNode;
  visible?: boolean;
  width?: string | number;
  flex?: number;
  className?: string;
  hint?: string;
  type?: 'text' | 'number' | 'date';
  sorted?: boolean;
};

export type RTableProps = {
  rows: NonNullable<Array<RTableModel>>;
  columns: NonNullable<ReadonlyArray<RTableColumnProps>>;
  getRowId?: (row: RTableModel) => string | number;
  height: string | number;
  classNames?: {
    table?: string;
    column?: string;
    header?: string;
    body?: string;
    row?: string;
  };
  pagination?: {
    count?: number;
    page?: number;
    defaultRowsPerPage?: number;
    rowsPerPage?: number[];
    previousPage?: React.ReactNode;
    nextPage?: React.ReactNode;
    previousPageClassName?: string;
    nextPageClassName?: string;
    of?: string;
  };
  toolbar?: {
    className?: string;
    visible?: boolean;
    actions?: (params: { ids: string[] }) => React.ReactNode;
    search?: {
      placeholder?: string;
      className?: string;
    };
  };
  selection?: {
    visible?: boolean;
    checkbox?: string;
  };
  extend?: {
    className: string;
    render: (params: { row: RTableModel; index: number }) => React.ReactNode;
  };
};

export type Order = 'asc' | 'desc';
