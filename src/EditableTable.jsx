import React, {useState, useEffect, useContext} from 'react';
import { Table, Input, TimePicker, Icon, Popconfirm, Form } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';

import EditableContext from './EditableContext';

const EditableTable = (props) => {

    const [data, setData] = useState();
    const [editingKey, setEditingKey] = useState('')

    const isEditing = (record) => {
        return record.key === editingKey;
    };

    const edit = (key) => {
        setEditingKey(key);
    };
    
    const cancel = () => {
        setEditingKey('');
    };    

    const iconStyle = {
        margin: 8,
        fontSize: '100%'
    }

    let columns = [
        {
          title: 'Note',
          dataIndex: 'note',
          editable: true,
        },
        {
            title: 'entry',
            dataIndex: 'entry',
            editable: true,
        },
        {
            title: 'exit',
            dataIndex: 'exit',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (text, record) => {
                const editable = isEditing(record);
                return (
                    <div>
                        {
                            // editable ? (
                            //     <span>
                            //         <EditableContext.Consumer>
                            //             {
                            //                 form => (
                            //                     <Icon type="check-circle" 
                            //                         theme="twoTone" twoToneColor="#52c41a" style={iconStyle}
                            //                         onClick={() => save(form, record.key)}/>
                            //                 )
                            //             }
                            //         </EditableContext.Consumer>    
                            //     </span>
                            // ) : (
                                 <Icon type="edit" theme="twoTone"
                                     onClick={() => edit(record.key)} type="edit" style={iconStyle} />
                            // )
                        }
                    </div>
                )
            }
        },
    ]

    columns = columns.map( col => {
        if( !col.editable )
            return col;

        return {
            ...col,
            onCell: (record, rowIndex) => ({
                record,
                inputType: (col.dataIndex === 'exit' ||
                            col.dataIndex === 'entry') ? 'time' : 'text',     
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            })
        }
    })

    useEffect( () => {

            const rawData = [
                { note: "one", entry: "10:00", exit: "18:00"},
                { note: "two", entry: "10:05", exit: "18:05"}
            ]

            const _data = rawData.map( (item, index) => (
                {
                    ...item, key: index
                }
            ))

            setData(_data)
        }
    , []);

    const EditableRow = ({ form, index, ...props }) => (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    )

    const EditableFormRow = Form.create()(EditableRow);

    const EditableCell = (props) => {

        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
          } = props;

        const getInput = () => ( props.inputType !== 'time') ?
          <Input size="small"/> :
          <TimePicker size='small'defaultValue={moment()}/>

        const form = useContext(EditableContext);
        const { getFieldDecorator } = form;

        const format = 'H:mm';

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                    {
                        getFieldDecorator(dataIndex, {
                            rules: [{
                                required: true,
                                message: `Please Input ${title}!`,
                            }], 
                            initialValue: (record[dataIndex] && props.inputType === 'time') ?
                                            moment.utc(record[dataIndex], format) 
                                            : undefined // (record[dataIndex])                           
                        })(getInput())
                    }
                    </Form.Item>
                ) : restProps.children}
            </td>
        )
    }

    const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
    };

    return (
        <Table bordered
            dataSource={data}
            tableLayout='auto'
            columns={columns}
            components={components}
            pagination={false}
            rowClassName="editable-row"/>
    )
}

export default Form.create({
    name: "report_table"
  })(EditableTable)