interface PredictionData {
  category: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}

const tumorDescriptions = {
  'Glioma Tumor': 'A type of brain tumor that develops from glial cells. These tumors can be low-grade or high-grade.',
  'Meningioma Tumor': 'A tumor that develops from the meninges, the protective layers around the brain and spinal cord.',
  'Pituitary Tumor': 'A growth that develops in the pituitary gland, which controls hormone production.',
  'No Tumor': 'No signs of tumor detected in the brain tissue. Normal brain anatomy observed.'
};

const getSeverity = (category: string): 'low' | 'medium' | 'high' | 'none' => {
  switch (category) {
    case 'Glioma Tumor': return 'high';
    case 'Meningioma Tumor': return 'medium';
    case 'Pituitary Tumor': return 'low';
    case 'No Tumor': return 'none';
    default: return 'none';
  }
};

export const generateMockPredictions = (): PredictionData[] => {
  const categories = ['Glioma Tumor', 'Meningioma Tumor', 'Pituitary Tumor', 'No Tumor'];
  
  // Generate random confidences that sum to ~100%
  const baseConfidences = [
    Math.random() * 70 + 15, // 15-85%
    Math.random() * 25 + 5,  // 5-30%
    Math.random() * 15 + 2,  // 2-17%
    Math.random() * 10 + 1   // 1-11%
  ];
  
  // Normalize to sum to 100%
  const total = baseConfidences.reduce((sum, conf) => sum + conf, 0);
  const normalizedConfidences = baseConfidences.map(conf => (conf / total) * 100);
  
  // Create predictions array
  const predictions = categories.map((category, index) => ({
    category,
    confidence: normalizedConfidences[index],
    description: tumorDescriptions[category as keyof typeof tumorDescriptions],
    severity: getSeverity(category)
  }));
  
  // Sort by confidence (highest first)
  return predictions.sort((a, b) => b.confidence - a.confidence);
};

export const simulateAnalysis = (file: File): Promise<PredictionData[]> => {
  return new Promise((resolve) => {
    // Simulate AI processing time
    setTimeout(() => {
      const predictions = generateMockPredictions();
      resolve(predictions);
    }, 2000 + Math.random() * 2000); // 2-4 seconds
  });
};