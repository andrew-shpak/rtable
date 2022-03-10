import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RTable from "../src";
import "./main.css";

const App = () => {
    return (
        <div style={{
            padding: 20
        }}>
            <div style={{
                height: "100%",
                width: "100%",
            }}>
                <RTable
                    classNames={{
                        table: "table",
                        column: "column",
                        header: "header",
                        body: "body",
                    }}
                    actions={{
                        width: "9vw",
                        className: "actions",
                        copy: {
                            onClick: (row) => {
                            },
                            content: "7"
                        }
                    }}
                    rows={[{
                        name: '1',
                        lastName: '1',
                        middleName: '3',
                        id: '1',
                    }, {
                        name: '1',
                        lastName: '1',
                        middleName: '3',
                        id: '2',
                    }]} columns={[{
                    key: 'name',
                    title: 'aets',
                    width: "1000px",
                }, {
                    key: 'lastName',
                    title: 'aets',
                    width: "1000px",
                }, {
                    key: 'middleName',
                    title: 'aets',
                    width: "1000px",
                }]}/>
            </div>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
