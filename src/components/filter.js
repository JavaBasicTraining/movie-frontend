import filterJson from '../config/filter-config.json';
import { Select } from 'antd';

const { Option } = Select;

export default function Filter() {
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const filterItem = (itemValue) => {
        var list = itemValue["subItems"].map((value, index) => {
            return <Option key={index} value={value}>{value}</Option>;
        });

        return <div className='filter_item'>
            <label>{itemValue.label}</label>
            <Select
                className='filter_select'
                defaultValue={itemValue}
                style={{
                    width: 120,
                }}
                onChange={handleChange}
            >
                {list}
            </Select>
        </div>
    }

    const listNav = () => {
        return filterJson["data"].map(value => {
            return <>{filterItem(value)}</>
        });
    }

    return (
        <div className='filter_bar'>
            {listNav()} 
        </div>
    )

}