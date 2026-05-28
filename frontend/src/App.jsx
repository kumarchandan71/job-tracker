import { useEffect, useState } from "react"
import axios from "axios"
import myphoto from "./assets/myphoto.jpg"

function App() {

  const [jobs, setJobs] = useState([])

  const [organization, setOrganization] = useState("")
  const [post, setPost] = useState("")
  const [status, setStatus] = useState("")
  const [lastDate, setLastDate] = useState("")

  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [applyLink, setApplyLink] = useState("")
  const [notes, setNotes] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [priority, setPriority] = useState("Medium")
  


  // Fetch Jobs
  const fetchJobs = () => {

    axios.get("https://job-tracker-backend-6zaw.onrender.com/jobs")
      .then((response) => {
        setJobs(response.data)
      })
  }


  useEffect(() => {
    fetchJobs()
  }, [])


  // Add Job
  const addJob = () => {

    axios.post("https://job-tracker-backend-6zaw.onrender.com/add-job", {

      organization,
      post,
      status,
      last_date: lastDate,
      apply_link: applyLink,
      notes: notes,
      is_pinned: isPinned,
      priority: priority

    })
      .then(() => {

        fetchJobs()

        setOrganization("")
        setPost("")
        setStatus("")
        setLastDate("")
        setApplyLink("")
        setNotes("")
        setIsPinned(false)
        setPriority("Medium")
      })
  }


  // Delete Job
  const deleteJob = (id) => {

    const num1 = Math.floor(Math.random() * 10) + 1

    const num2 = Math.floor(Math.random() * 10) + 1

    const operations = ["+", "-", "*"]

    const operation =
      operations[Math.floor(Math.random() * operations.length)]

    const userAnswer = prompt(
      `Solve to confirm deletion:\n\n${num1} ${operation} ${num2} = ?`
    )

    // Master Delete Key
    if (userAnswer !== "71") {

      alert("Wrong answer. Deletion cancelled.")

      return
    }

    axios.delete(
      `https://job-tracker-backend-6zaw.onrender.com/delete-job/${id}`
    )

      .then(() => {

        fetchJobs()

        alert("Job deleted successfully")
      })
  }


  // Edit Job
  const editJob = (job) => {

    setEditId(job.id)

    setOrganization(job.organization)
    setPost(job.post)
    setStatus(job.status)
    setLastDate(job.last_date)
    setApplyLink(job.apply_link)
    setNotes(job.notes)

    setIsPinned(job.is_pinned)
    setPriority(job.priority)

  }


  // Update Job
  const updateJob = () => {

    axios.put(`https://job-tracker-backend-6zaw.onrender.com/update-job/${editId}`, {

      organization,
      post,
      status,
      last_date: lastDate,
      apply_link: applyLink,
      notes: notes,


      is_pinned: isPinned,
      priority: priority

    })
      .then(() => {

        fetchJobs()

        setOrganization("")
        setPost("")
        setStatus("")
        setLastDate("")
        setApplyLink("")
        setNotes("")
        setIsPinned(false)
        setPriority("Medium")

        setEditId(null)
      })
  }

  const getDaysLeft = (dateString) => {

    const today = new Date()

    const lastDate = new Date(dateString)

    const difference = lastDate - today

    const daysLeft = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )

    return daysLeft
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

      <div className="text-center mb-10">

        <img
          src={myphoto}
          alt="Chandan"
          className="w-25 h-30 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
        />

        <h1 className="text-4xl font-bold">
          Smart Job Tracker
        </h1>

        <p className="text-gray-500 mt-2">
          Track • Apply • Succeed
        </p>

      </div>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl shadow-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl shadow-sm"
        >

          <option value="All">All Status</option>

          <option value="Pending">Pending</option>

          <option value="Applied">Applied</option>

          <option value="Interview">Interview</option>

          <option value="Rejected">Rejected</option>

          <option value="Selected">Selected</option>

        </select>

        {/* Form */}

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Post"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Apply Link"
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-3 rounded-lg"
            ></textarea>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border p-3 rounded-lg"
            >

              <option value="High">High Priority</option>

              <option value="Medium">Medium Priority</option>

              <option value="Low">Low Priority</option>

            </select>

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />

              Pin Job

            </label>


          </div>


          <button
            onClick={editId ? updateJob : addJob}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >

            {editId ? "Update Job" : "Add Job"}

          </button>

        </div>


        {/* Job Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {
            jobs
            .filter((job) => {

              const matchesSearch =

                job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||

                job.post.toLowerCase().includes(searchTerm.toLowerCase()) ||

                job.status.toLowerCase().includes(searchTerm.toLowerCase())


              const matchesFilter =

                filterStatus === "All" ||

                job.status.toLowerCase().includes(filterStatus.toLowerCase())


              return matchesSearch && matchesFilter
            })
            
            .sort((a, b) => b.is_pinned - a.is_pinned)

            .map((job) => (

              <div
                key={job.id}
                className="bg-white p-6 rounded-xl shadow-md"
              >

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">

                  {job.is_pinned && "📌"}

                  {job.organization}

                </h2>

                <p className="mt-2">

                  Priority:

                  <span
                    className={`font-semibold px-3 py-1 rounded-lg ml-2 text-white

                      ${
                        job.priority === "High"
                          ? "bg-red-600"

                          : job.priority === "Medium"
                            ? "bg-yellow-500"

                            : "bg-green-600"
                      }

                    `}
                  >

                    {job.priority}

                  </span>

                </p>

                <p className="text-lg">
                  {job.post}
                </p>



                <p className="mt-2">
                  Status:

                  <span
                    className={`font-semibold px-3 py-1 rounded-lg ml-2 text-white

                      ${
                        job.status.toLowerCase().includes("applied")
                          ? "bg-green-600"

                        : job.status.toLowerCase().includes("pending")
                          ? "bg-yellow-500"

                        : job.status.toLowerCase().includes("reject")
                          ? "bg-red-600"

                        : job.status.toLowerCase().includes("interview")
                          ? "bg-blue-600"

                        : job.status.toLowerCase().includes("selected")
                          ? "bg-purple-600"

                        : "bg-gray-600"
                      }

                    `}
                  >

                    {job.status}

                  </span>

                </p>

                <p className="mt-2">
                  Last Date:
                  <span className="font-semibold">
                    {" "}
                    {new Date(job.last_date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </span>
                </p>

                
                <p className="mt-2">
                  Notes:
                  <span className="font-semibold">
                    {" "}{job.notes || "No Notes"}
                  </span>
                </p>

                <p className="mt-3">

                  {
                    getDaysLeft(job.last_date) < 0

                      ? (

                        <span className="bg-red-700 text-white px-3 py-1 rounded-lg">

                          Expired

                        </span>
                      )

                      : getDaysLeft(job.last_date) <= 7

                        ? (

                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">

                            {getDaysLeft(job.last_date)} days left

                          </span>
                        )

                        : (

                          <span className="bg-green-600 text-white px-3 py-1 rounded-lg">

                            {getDaysLeft(job.last_date)} days left

                          </span>
                        )
                  }

                </p>




                <div className="flex gap-3 mt-5">

                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Apply
                  </a>

                  <button
                    onClick={() => editJob(job)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => deleteJob(job.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  )
}

export default App