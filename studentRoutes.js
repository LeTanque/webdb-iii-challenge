const router = require('express').Router();
const knex = require('knex'); 

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/lambda.sqlite3',
    },
    // debug: true,
};
const db = knex(knexConfig);
const errors = { // Dynamic error messaging based on sqlite codes
    '1': 'We ran into an error.',
    '4': 'Operation aborted',
    '9': 'Operation aborted',
    '19': 'Another record with that value exists, yo!'
};


// Endpoints
// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await db('students');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET a student by id
router.get('/:id', async (req, res) => {
    try {
        const student = await db('students')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json(error);
    }
});


// POST create new student. Name is required. CohortID is required. CohortID must exist, no students without existing cohorts.
router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.cohort_id) { 
        return res.status(400).json({ message:"Please include a name and cohort id to create a new student" 
    })}
    const cohortExists = await db('cohorts')
        .where({ id: req.body.cohort_id })
        .first();
    if (!cohortExists) {
        return res.status(404).json({ message:"Cohort doesn't exist. Please update cohort ID and try again." });
    }
    try {
        const [id] = await db('students').insert(req.body);
        const student = await db('students')
            .where({ id })
            .first();
        res.status(201).json(student);
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});


// PUT update without name param
router.put('/', async (req, res) => {
    res.status(400).json({ message:"Please include student ID to update" })
})


// PUT update student. name and cohort_id required. Must be unique req.body.name. Must be cohort that exists
router.put('/:id', async (req, res) => {
    if (!req.body.name || !req.body.cohort_id) { return res.status(400).json({ message:"Please include a name and cohort ID to update a student" })}
    const cohortExists = await db('cohorts')
        .where({ id: req.body.cohort_id })
        .first();
    if (!cohortExists) {
        return res.status(404).json({ message:"Cohort doesn't exist. Please update cohort ID and try again." });
    }
    try {
        const count = await db('students')
            .where({ id: req.params.id })
            .update(req.body);
        if (count > 0) {
            const student = await db('students')
                .where({ id: req.params.id })
                .first();
            res.status(200).json(student);
        } else {
            res.status(404).json({ message:"Records not found" });
        }
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});


// DELETE remove student
router.delete('/:id', async (req, res) => {
    try {
        const count = await db('students')
            .where({ id: req.params.id })
            .del();
        if (count > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({ message:"Student not found" });
        }
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});






module.exports = router;
