// components/WelcomeModal.js
import React from 'react';
import { Button, Text } from 'components';
/**
 * Function to calculate calories burned based on time spent on activity
 * @param {number} hours - The number of hours spent on the activity
 * @param {number} minutes - The number of minutes spent on the activity
 * @param {number} caloriesPerHour - Calories burned per hour (default is 400)
 * @returns {number} The total calories burned
 */
function calculateCalories(hours, minutes, caloriesPerHour = 400) {
    // Convert the total time into hours
    const totalTimeInHours = hours + minutes / 60;

    // Calculate the total calories burned
    const totalCaloriesBurned = totalTimeInHours * caloriesPerHour;

    return totalCaloriesBurned;
}

const QuoteModal = ({ onClose, timeSpent }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-blue-100 p-5 rounded-lg shadow-lg w-96 text-center">
                <div className="text-2xl font-semibold text-blue-300 mb-4">Thanks!</div>
                <div className="text-gray-800 mb-4">
                    Many thanks for spending {timeSpent.hours} hours on "Activity" today. Today you spent{" "}
                    {calculateCalories(timeSpent.hours, timeSpent.minutes)} calories. We wish you great health, fitness, and happiness.
                </div>
                <Button type="button" onClick={onClose} className="w-1/2 mt-4 rounded-lg" color="indigo_A200">Close</Button>

            </div>
        </div>

    );
};

export default QuoteModal;
