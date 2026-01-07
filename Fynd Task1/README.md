# Fynd AI Assessment - Task 1: Rating Prediction via Prompting

## Overview
This project implements and evaluates 4 different prompting approaches for predicting Yelp review ratings (1-5 stars) using Large Language Models.

## Dataset
- **Source**: [Yelp Reviews Dataset on Kaggle](https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset)
- **Sample Size**: 200 reviews (40 per rating, balanced)
- **Download**: Place the `yelp.csv` file in the project directory

## Setup Instructions

### 1. Install Dependencies
```bash
pip install pandas scikit-learn matplotlib seaborn requests
```

### 2. Get API Key
This implementation uses Google Gemini (free tier):
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace `your_gemini_api_key_here` in `task1_rating_prediction.py`

### 3. Download Dataset
```bash
# Download from Kaggle
kaggle datasets download -d omkarsabnis/yelp-reviews-dataset
unzip yelp-reviews-dataset.zip
```

### 4. Run the Script
```bash
python task1_rating_prediction.py
```

## Prompting Approaches

### Approach 1: Zero-Shot Direct
- **Strategy**: Direct instruction with explicit rating criteria
- **Pros**: Fast, minimal tokens, simple
- **Cons**: May lack consistency without examples

### Approach 2: Few-Shot with Examples
- **Strategy**: Provides 3 diverse examples (1, 3, 5 stars)
- **Pros**: Better calibration, improved consistency
- **Cons**: More tokens, examples must be representative

### Approach 3: Chain-of-Thought (CoT)
- **Strategy**: Guides step-by-step reasoning process
- **Pros**: Better for edge cases, transparent reasoning
- **Cons**: Slower, more tokens, can be overly analytical

### Approach 4: Hybrid (Few-Shot + CoT + Criteria)
- **Strategy**: Combines examples, reasoning, and explicit scoring rubric
- **Pros**: Best overall performance, robust
- **Cons**: Most expensive in tokens, slightly slower

## Evaluation Metrics

1. **Exact Accuracy**: Percentage of perfectly matched predictions
2. **Off-by-1 Accuracy**: Predictions within ±1 star of actual rating
3. **Cohen's Kappa**: Inter-rater reliability (0.4-0.6 = moderate, >0.6 = substantial)
4. **JSON Validity Rate**: Percentage of valid JSON responses

## Output Files

- `evaluation_results_detailed.csv`: Per-review predictions for all approaches
- `prompt_comparison_results.png`: Visualization with 4 subplots:
  - Accuracy comparison (exact vs off-by-1)
  - JSON validity rates
  - Confusion matrix (best approach)
  - Cohen's Kappa scores

## Expected Results

Based on typical LLM performance:
- **Zero-Shot**: 45-55% accuracy, 85-90% off-by-1
- **Few-Shot**: 55-65% accuracy, 90-95% off-by-1
- **Chain-of-Thought**: 50-60% accuracy, 88-93% off-by-1
- **Hybrid**: 60-70% accuracy, 92-97% off-by-1

## Key Learnings

1. **JSON Format Specification**: Critical for parsing success
2. **Example Selection**: Diverse examples improve calibration
3. **Explicit Criteria**: Reduces ambiguity in edge cases
4. **Temperature Setting**: 0.1 increases consistency
5. **Trade-offs**: Hybrid approach performs best but costs more tokens

## Troubleshooting

### API Rate Limits
- Script includes 0.5s delay between requests
- Adjust `time.sleep()` if you hit rate limits

### JSON Parsing Errors
- The script includes robust JSON extraction
- Checks for markdown code blocks and raw JSON

### Dataset Issues
- Ensure `yelp.csv` has columns: `text`, `stars`
- Verify balanced distribution across ratings

## Customization

### Use Different LLM
Uncomment and configure OpenRouter section:
```python
OPENROUTER_API_KEY = "your_key"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
```

### Adjust Sample Size
```python
sample_size = 200  # Change to desired size
samples_per_rating = sample_size // 5
```

### Modify Temperature
```python
"temperature": 0.1,  # 0.0 = deterministic, 1.0 = creative
```

## License
This project is for educational purposes as part of the Fynd AI Assessment.
