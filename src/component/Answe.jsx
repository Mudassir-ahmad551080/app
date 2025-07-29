import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { checkheading } from './helper';

const isCodeBlock = (text) => {
  const hasBackticks = /```/.test(text);
  const hasCodeKeywords = /(function|const|let|var|import|class|return|=>|\{|\})/.test(text);
  return hasBackticks || hasCodeKeywords;
};

const extractCode = (text) => {
  // Remove triple backticks if present
  const cleaned = text.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
  return cleaned.trim();
};

const Answe = ({ ans, type }) => {
  const [isCode, setIsCode] = useState(false);
  const [cleanedAns, setCleanedAns] = useState('');

  useEffect(() => {
    let raw = typeof ans === 'string' ? ans : String(ans ?? '');
    const codeDetected = isCodeBlock(raw);
    setIsCode(codeDetected);
    setCleanedAns(codeDetected ? extractCode(raw) : raw.replace(/\*\*/g, ''));
  }, [ans]);

  const isQuestion = type === 'q';

  return (
    <motion.div
      className={`rounded-lg my-2 w-fit max-w-full px-3 py-2 break-words ${
        isQuestion ? 'self-end bg-indigo-600 rounded-tl-4xl rounded-br-3xl text-center' : 'self-start text-left '
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isCode ? (
        <pre className="bg-black text-lime-400 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
          <code>{cleanedAns}</code>
        </pre>
      ) : (
        <span className={checkheading(cleanedAns) ? 'font-bold' : ''}>{cleanedAns}</span>
      )}
    </motion.div>
  );
};

export default Answe;
