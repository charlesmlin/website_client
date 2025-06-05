import { useState, useEffect } from "react";

const QuizComponent = ({ apiUrl, userId, certification }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Options user have chosen for the question
  const [selectedOptions, setSelectedOptions] = useState([]);

  // If current question has been answered
  const [submitted, setSubmitted] = useState(false);

  // If current question is correct
  const [correct, setCorrect] = useState(null);

  // List of questions fetched from server thus far
  const [questionHistory, setQuestionHistory] = useState([]);

  // Index for question where user is currently at
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // User answer for the given question number
  const [questionAttempts, setQuestionAttempts] = useState(new Map());

  // Last question fetched from server
  const [questionIndex, setQuestionIndex] = useState(0);

  // Get question from server
  const getQuestion = async (apiUrl, userId, certification, questionIndex) => {
    try {
      const response = await fetch(
        `${apiUrl}/aws/question/${userId}/${certification}/${questionIndex}`
      );
      if (!response.ok) {
        return undefined;
      }
      let questionJson = await response.json();
      return questionJson.success ? questionJson : undefined;
    } catch (err) {
      return undefined;
    }
  };

  const loadQuestion = (question) => {
    setCurrentQuestion(question);

    // Load cached attempt if exists
    const cachedAttempt = questionAttempts.get(question.question_number);
    if (cachedAttempt) {
      setSelectedOptions(cachedAttempt.selectedOptions);
      setSubmitted(cachedAttempt.submitted);
      setCorrect(isCorrect(question.answer, cachedAttempt.selectedOptions));
    } else {
      setSelectedOptions([]);
      setSubmitted(false);
      setCorrect(null);
    }
  };

  const loadNewQuestion = async () => {
    const newQuestion = await getQuestion(
      apiUrl,
      userId,
      certification,
      currentHistoryIndex + 1
    );
    if (newQuestion === undefined) {
      return;
    }

    loadQuestion(newQuestion);

    const newHistory = [...questionHistory, newQuestion];
    setQuestionHistory(newHistory);
    setCurrentHistoryIndex(currentHistoryIndex + 1);
    setQuestionIndex(questionIndex + 1);
  };

  const loadPreviousQuestion = () => {
    if (currentHistoryIndex > 1) {
      // currentHistoryIndex is indexed at 1 and questionHistory is indexed at 0, so -2 is requried for previous question
      const prevQuestion = questionHistory[currentHistoryIndex - 2];
      loadQuestion(prevQuestion);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  };

  const loadNextQuestion = async () => {
    if (currentHistoryIndex < questionHistory.length) {
      const nextQuestion = questionHistory[currentHistoryIndex];
      loadQuestion(nextQuestion);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    } else {
      await loadNewQuestion();
    }
  };

  const handleReset = () => {
    if (!currentQuestion) return;

    // Reset question state
    setSelectedOptions([]);
    setSubmitted(false);
    setCorrect(null);

    // Remove from cache
    setQuestionAttempts((prev) => {
      const newMap = new Map(prev);
      newMap.delete(currentQuestion.question_number);
      return newMap;
    });
  };

  const handleSubmit = async () => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    setSubmitted(true);
    setCorrect(isCorrect(currentQuestion.answer, selectedOptions));

    setQuestionAttempts(
      (prev) =>
        new Map(
          prev.set(currentQuestion.question_number, {
            selectedOptions: [...selectedOptions],
            submitted: true,
          })
        )
    );
  };

  const isCorrect = (list1, list2) => {
    if (list1.length !== list2.length) return false;

    const set1 = new Set(list1);
    const set2 = new Set(list2);

    if (set1.size !== set2.size) return false;

    for (const item of set1) {
      if (!set2.has(item)) return false;
    }

    return true;
  };

  // Initialize with first question
  useEffect(() => {
    const initializeFirstQuestion = async () => {
      const firstQuestion = await getQuestion(apiUrl, userId, certification, 1);
      if (firstQuestion) {
        loadQuestion(firstQuestion);
        setQuestionHistory([firstQuestion]);
        setCurrentHistoryIndex(1);
        setQuestionIndex(1);
      }
    };
    initializeFirstQuestion();
  }, [apiUrl, userId, certification]);

  const handleOptionChange = (optionKey) => {
    if (!currentQuestion) return;

    const isMultipleChoice = currentQuestion.answer.length > 1;

    if (isMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionKey)
          ? prev.filter((key) => key !== optionKey)
          : [...prev, optionKey]
      );
    } else {
      setSelectedOptions([optionKey]);
    }
  };

  const getOptionClassName = (optionKey) => {
    if (!submitted) return "bg-white hover:bg-gray-50";

    const isCorrect = currentQuestion.answer.includes(optionKey);
    const isSelected = selectedOptions.includes(optionKey);

    if (isCorrect && isSelected) return "bg-green-200";
    if (isCorrect && !isSelected) return "bg-green-100";
    if (!isCorrect && isSelected) return "bg-red-200";
    return "bg-white";
  };

  if (!currentQuestion) {
    return <div className="p-6">Loading question...</div>;
  }

  const isMultipleChoice = currentQuestion.answer.length > 1;

  return (
    <div className="font-normal max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentQuestion.question}
        </h2>

        {isMultipleChoice && (
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Select multiple answers ({currentQuestion.answer.length} correct
            answers)
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {Object.entries(currentQuestion.options).map(([key, value]) => (
          <label
            key={`Option${key}`}
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${getOptionClassName(
              key
            )} ${submitted ? "cursor-default" : "cursor-pointer"}`}
          >
            <input
              type={isMultipleChoice ? "checkbox" : "radio"}
              name="quiz-option"
              value={key}
              checked={selectedOptions.includes(key)}
              onChange={() => handleOptionChange(key)}
              disabled={submitted}
              className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-700">{key}.</span>
              <span className="ml-2 text-gray-800">{value}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Submit and Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={loadPreviousQuestion}
          disabled={currentHistoryIndex <= 1}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0 || submitted}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitted ? "Submitted" : "Submit Answer"}
          </button>

          {submitted && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>

        <button
          onClick={loadNextQuestion}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Explanation Area */}
      {submitted && correct === false && currentQuestion?.explanation && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          {currentQuestion.explanation?.keyPointToTest && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Summary:
              </h3>
              <div className="text-base text-gray-800 mb-3">
                The question is to test user's ability to:
                <ul className="list-disc list-inside">
                  {currentQuestion.explanation.keyPointToTest.map(
                    (point, idx) => (
                      <li key={`KeyPoint${idx}`}>{point}</li>
                    )
                  )}
                </ul>
              </div>
            </section>
          )}
          {currentQuestion.explanation?.terminology && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Terminology:
              </h3>
              <div className="mt-4">
                <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Concept
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Explanation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.explanation.terminology.map(
                      (item, idx) => {
                        const concept = Object.keys(item)[0];
                        const explanation = item[concept];
                        return (
                          <tr key={`TerminologyRow${idx}`}>
                            <td className="border border-gray-300 px-3 py-2">
                              {concept}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {explanation}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {currentQuestion.explanation?.options && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Options correctness:
              </h3>
              <div className="mt-4">
                <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Option
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Correct
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Explanation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(currentQuestion.explanation.options).map(
                      ([letter, detail]) => {
                        return (
                          <tr key={`AnswerOption${letter}`}>
                            <td className="border border-gray-300 px-3 py-2">
                              {letter}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {detail.correct === "yes" ? "✅" : "❌"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {detail.reason}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Question Counter */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Question {currentHistoryIndex} of {questionHistory.length} viewed
      </div>
    </div>
  );
};

export default QuizComponent;
