// components/WelcomeModal.js
import React from 'react';
import { Button, Text } from 'components';

const QuoteModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-100 p-5 rounded-lg shadow-lg w-96 text-center">
                <Text className="text-center text-xl font-semibold mb-4 ">Thanks !</Text>
                <Text className="text-center mb-4">Many thanks for spending xxx hours for "Activity" Today. Today you spent xx Calories. We wish you great health, fitness and happiness..</Text>
                <Button type="button" onClick={onClose} className="w-1/2 mt-4 rounded-lg" color="indigo_A200">Close</Button>
            </div>
        </div>
    );
};

export default QuoteModal;
