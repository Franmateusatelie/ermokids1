import React from 'react';
import { motion } from 'framer-motion';

export default function DraggableItem({ item, onDragEnd, children, className = '' }) {
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        onDragEnd(item, info.point);
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  );
}