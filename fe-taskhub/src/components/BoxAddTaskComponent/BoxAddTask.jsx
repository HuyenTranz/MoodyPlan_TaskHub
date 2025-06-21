import React, { useState } from 'react';
import {
    useFloating,       // Hook chính để tính toán vị trí dropdown
    flip,              // Middleware: lật dropdown nếu không đủ không gian
    shift,             // Middleware: dịch sang trái/phải để tránh tràn ra ngoài
    offset,            // Middleware: tạo khoảng cách giữa trigger và dropdown
    autoUpdate,        // Middleware: tự động cập nhật vị trí khi DOM thay đổi
    useDismiss,        // Middleware: tự động đóng dropdown khi click ra ngoài
    useInteractions    // Hook để gom các hành vi tương tác (dismiss, hover, v.v.)
} from '@floating-ui/react';

import { RiArrowDownSLine } from 'react-icons/ri';  // Icon mũi tên xuống
import { FiCalendar } from 'react-icons/fi';        // Icon lịch
import DateSelectorDay from '../DateSelectorDay';
import { IoMdArrowDropdown } from "react-icons/io";

const BoxAddTask = () => {
    // Danh sách các project và section tương ứng
    const projects = [
        { name: 'Inbox', sections: ['General'] },
        { name: 'Personal', sections: ['Health', 'Finance', 'Fitness'] },
        { name: 'Work', sections: ['Frontend', 'Backend', 'Meetings'] },
        { name: 'Work', sections: ['Frontend', 'Backend', 'Meetings'] },
        { name: 'Work', sections: ['Frontend', 'Backend', 'Meetings'] }
    ];

    // State hiện tại cho project và section được chọn
    const [selectedProject, setSelectedProject] = useState(projects[0]);
    const [selectedSection, setSelectedSection] = useState(projects[0].sections[0]);

    // Trạng thái dropdown đang mở hay không
    const [showDropdown, setShowDropdown] = useState(false);

    // useFloating để định vị dropdown
    const {
        refs,             // refs.setReference (trigger) và refs.setFloating (dropdown)
        floatingStyles,   // styles để định vị dropdown (top, left, etc.)
        context           // context để sử dụng các middleware
    } = useFloating({
        open: showDropdown,
        onOpenChange: setShowDropdown, // hàm callback khi đóng/mở dropdown
        middleware: [
            offset(3),  // cách trigger 3px
            flip(),     // tự động lật lên nếu không đủ chỗ dưới
            shift()     // nếu tràn ra ngoài thì đẩy vào trong
        ],
        whileElementsMounted: autoUpdate, // theo dõi kích thước để cập nhật lại vị trí
        placement: 'bottom-start'         // hiển thị dropdown phía dưới - căn trái
    });

    // useDismiss để đóng dropdown khi click bên ngoài
    const dismiss = useDismiss(context);

    // Kết hợp dismiss vào các hành vi tương tác
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

    // Khi người dùng chọn section
    const handleSelect = (project, section) => {
        setSelectedProject(project);
        setSelectedSection(section);
        setShowDropdown(false); // đóng dropdown sau khi chọn
    };

    return (
        <div className="add-task-card">
            {/* Input tiêu đề task */}
            <input type="text" placeholder="Submit" className="task-title" />

            {/* Input mô tả task */}
            <input type="text" placeholder="Description" className="task-description" />

            {/* Các tuỳ chọn kèm theo task (ví dụ: chọn ngày) */}
            <div className="task-options">
                <DateSelectorDay />
            </div>

            <div className="task-footer">
                <div className="task-dropdown-wrapper">
                    {/* Trigger mở dropdown (ref cho floating-ui + props tương tác) */}
                    <div
                        className="task-dropdown"
                        ref={refs.setReference}
                        onClick={() => setShowDropdown(prev => !prev)}
                        {...getReferenceProps()}
                    >
                        <button className="header-button secondary">
                            {selectedProject.name} / {selectedSection}
                            <IoMdArrowDropdown className="header-icon-button" />
                        </button>

                    </div>

                    {/* Dropdown menu hiển thị khi showDropdown = true */}
                    {showDropdown && (
                        <div
                            className="project-dropdown-menu"
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                        >
                            {projects.map((project, i) => (
                                <div key={i} className="dropdown-project-block">
                                    <div className="dropdown-project-name">{project.name}</div>
                                    {project.sections.map((section, j) => (
                                        <div
                                            key={j}
                                            className={`dropdown-section-item ${selectedProject.name === project.name &&
                                                selectedSection === section
                                                ? 'active'
                                                : ''
                                                }`}
                                            onClick={() => handleSelect(project, section)}
                                        >
                                            {section}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Các nút hành động */}
                <div className="task-actions">
                    <button className="header-button secondary">Cancel</button>
                    <button className="header-button">Add task</button>
                </div>
            </div>
        </div>
    );
};

export default BoxAddTask;
