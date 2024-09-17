import { InputNumber, Modal, Select } from 'antd';
import React, { useState } from 'react';

interface Props {
    isVisible: boolean;
    onCancel: () => void;
    onOk: (sportType: string, availablePeoples: number) => void;
}

const SetReservationModal: React.FC<Props> = ({ isVisible, onCancel, onOk }) => {
    const [selectedSportType, setSelectedSportType] = useState<string>('');
    const [availablePeoples, setAvailablePeoples] = useState<number>(1);

    const handleOk = () => {
        onOk(selectedSportType, availablePeoples);
        // 可以在这里清除状态，或者留给父组件在处理完毕后清除
        setSelectedSportType('');
        setAvailablePeoples(1);
    };

    return (
        <Modal
            title="设置预约人数"
            open={isVisible}
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Select
                value={selectedSportType}
                onChange={setSelectedSportType}
                style={{ width: 120, marginBottom: 20 }}
            >
                <Select.Option value="BADMINTON">羽毛球</Select.Option>
                <Select.Option value="BASKETBALL">篮球</Select.Option>
            </Select>
            <br />
            <InputNumber
                min={1}
                max={100}
                value={availablePeoples}
                onChange={value => setAvailablePeoples(value ?? 1)}
            />
        </Modal>
    );
};

export default SetReservationModal;
