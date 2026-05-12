import React, { useMemo, useState } from 'react';
import DynamicTable from './DynamicTable';

const AppliedListSection = ({ data = [] ,heading =[],showFilters}) => {
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const yearOptions = useMemo(() => {
        const years = [...new Set(data.map((item) => item.year))];
        return years.map((year) => ({ label: year, value: year }));
    }, [data]);

    const departmentOptions = useMemo(() => {
        const department = [...new Set(data.map((item) => item.department))];
        return department.map((department) => ({ label: department, value: department }));
    }, [data]);

    const filteredAppliedList = useMemo(() => {
        return data.filter((item) => {
            const query = search.toLowerCase();
            const matchesSearch =
                item?.name?.toLowerCase().includes(query) ||
                item?.college?.toLowerCase().includes(query) ||
                item?.department?.toLowerCase().includes(query) ||
                item?.contact?.toLowerCase().includes(query) ||
                item?.mail?.toLowerCase().includes(query) ||
                item?.location?.toLowerCase().includes(query);

            const matchesYear = yearFilter ?String(item.year) === yearFilter : true;
            const matchesLocation = departmentFilter ? item.department === departmentFilter : true;

            return matchesSearch && matchesYear && matchesLocation;
        });
    }, [data, search, yearFilter, departmentFilter]);



    return (
        <div className="bg-white rounded-[20px] border border-gray-100 ">
            <DynamicTable
                columns={heading}
                dataSource={filteredAppliedList}
                rowKey="id"
                showSearch={true}
                searchPlaceholder="Search ..."
                onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                filters={[
                    {
                        key: 'year',
                        placeholder: 'All Year',
                        value: yearFilter,
                        options: yearOptions,
                        onChange: (value) => {
                            setYearFilter(value);
                            setCurrentPage(1);
                        },
                    },
                    {
                        key: 'department',
                        placeholder: 'All Department',
                        value: departmentFilter,
                        options: departmentOptions,
                        onChange: (value) => {
                            setDepartmentFilter(value);
                            setCurrentPage(1);
                        },
                    },
                ]}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AppliedListSection;
