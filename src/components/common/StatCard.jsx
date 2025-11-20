import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

const StatCard = ({ title, value, trend, bgColor, animate, delay = 0 }) => {
  return (
    <Motion.div
      initial={{ x: -12, opacity: 0 }}
      animate={animate ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <Card className={`${bgColor} text-white transform transition-all duration-500 hover:scale-105`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold">{value}</span>
            <div className="flex items-start">
              {trend === 'up' && (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/30 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </span>
              )}
              {trend === 'down' && (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/30 shadow-sm">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                </span>
              )}
            </div>
          </div>
          <div className="text-sm opacity-90">{title}</div>
        </CardContent>
      </Card>
    </Motion.div>
  );
};

export default StatCard;