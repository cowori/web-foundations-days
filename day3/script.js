let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];

/*
Searches for notes containing the supplied word.
The search ignores uppercase and lowercase differences.
*/
function searchNotes(word) {
    const searchWord = word.toLowerCase();

    return notes.filter((note) =>
        note.text.toLowerCase().includes(searchWord)
    );
}

/*
Returns the note containing the most characters.
Returns null when the notes array is empty.
*/
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (const note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}

/*
Counts how many notes belong to each category.
*/
function countByCategory() {
    const counts = {};

    for (const note of notes) {
        if (counts[note.category]) {
            counts[note.category] += 1;
        } else {
            counts[note.category] = 1;
        }
    }

    return counts;
}

/*
Returns a sentence summarizing the number of notes
and the number of notes in each category.
*/
function getSummary() {
    const counts = countByCategory();
    const noteWord = notes.length === 1 ? "note" : "notes";

    const personalCount = counts.personal || 0;
    const workCount = counts.work || 0;
    const studyCount = counts.study || 0;

    return `${notes.length} ${noteWord}: ${personalCount} personal, ${workCount} work, ${studyCount} study.`;
}

/*
Checks whether a note with matching text already exists.
The comparison ignores uppercase and lowercase differences
and spaces at the beginning or end.
*/
function isDuplicate(text) {
    const normalizedText = text.trim().toLowerCase();

    return notes.some(
        (note) => note.text.trim().toLowerCase() === normalizedText
    );
}

/*
Adds a new note only when:
1. The text contains between 1 and 200 characters.
2. The note is not a duplicate.
3. The category is personal, work, or study.

Returns true when a note is added.
Returns false and logs the reason when it is rejected.
*/
function addNote(text, category) {
    const cleanedText = text.trim();
    const allowedCategories = ["personal", "work", "study"];

    if (cleanedText.length < 1 || cleanedText.length > 200) {
        console.log("Note not added: text must be between 1 and 200 characters.");
        return false;
    }

    if (isDuplicate(cleanedText)) {
        console.log("Note not added: this note already exists.");
        return false;
    }

    if (!allowedCategories.includes(category)) {
        console.log(
            "Note not added: category must be personal, work, or study."
        );
        return false;
    }

    const newNote = {
        id: notes.length === 0
            ? 1
            : Math.max(...notes.map((note) => note.id)) + 1,
        text: cleanedText,
        category: category,
    };

    notes.push(newNote);
    console.log("Note added successfully.");
    return true;
}

/*
==================================================
FUNCTION TESTS
==================================================
*/

/*
1. searchNotes tests
*/

console.log(searchNotes("day"));
// Expected: an array containing "Finish the Day 3 assignment"

console.log(searchNotes("holiday"));
// Expected: [] because no note contains "holiday"

console.log(searchNotes("BUY"));
// Expected: an array containing "Buy milk and bread"
// This also confirms that the search ignores letter case.

/*
2. longestNote tests
*/

console.log(longestNote());
// Expected: the work note with id 3:
// "Email the project report to Grace"

const savedNotesForLongestTest = notes;
notes = [];

console.log(longestNote());
// Expected: null because notes is temporarily empty

notes = savedNotesForLongestTest;

/*
3. countByCategory tests
*/

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

const savedNotesForCountTest = notes;
notes = [];

console.log(countByCategory());
// Expected: {}

notes = savedNotesForCountTest;

/*
4. getSummary tests
*/

console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

const savedNotesForSummaryTest = notes;
notes = [
    { id: 1, text: "Read a chapter", category: "study" },
];

console.log(getSummary());
// Expected: "1 note: 0 personal, 0 work, 1 study."

notes = savedNotesForSummaryTest;

/*
5. isDuplicate tests
*/

console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true because case and surrounding spaces are ignored

console.log(isDuplicate("Attend a coding workshop"));
// Expected: false because this note does not exist

/*
6. addNote tests
*/

console.log(addNote("Attend a coding workshop", "study"));
// Expected: logs "Note added successfully." and returns true

console.log(addNote("Attend a coding workshop", "study"));
// Expected: logs duplicate reason and returns false

console.log(addNote("", "personal"));
// Expected: logs text-length reason and returns false

console.log(addNote("Prepare meeting notes", "business"));
// Expected: logs invalid-category reason and returns false

console.log(notes);
// Expected: the original five notes plus the newly added study note
``