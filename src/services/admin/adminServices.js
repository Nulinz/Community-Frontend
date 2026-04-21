import API from "../../utils/api";


// create company
export const createCompany = async (payload) => {
  const response = await API.post("/company/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// get company
export const getAllCpmpanies = async () => {
  const response = await API.get("/company/all")
  return response.data
}

export const getCompanyNames = async () => {
  const response = await API.get("/company/names");
  return response.data;
};


export const getCompanyById = async (id) => {
  const response = await API.get(`/company/getById/${id}`);
  return response.data;
};

export const getMyCompany = async () => {
  const response = await API.get("/company/get-mine");
  return response.data;
};


export const addCompanyPost = async (id, formData) => {
  const response = await API.post(`/company/add-post/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const setCompanyPassword = async (payload) => {
  const response = await API.post("/company/set-password", payload);
  return response.data;
};

export const toggleCompanyStatus = async (id) => {
  const response = await API.patch(`/company/toggle-status/${id}`);
  return response.data;
};




export const createCollege = async (payload) => {
  const response = await API.post("/college/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllColleges = async () => {
  const response = await API.get("/college/all");
  return response.data;
};

export const getCollegeById = async (id) => {
  const response = await API.get(`/college/getById/${id}`);
  return response.data;
};

export const toggleCollegeStatus = async (id) => {
  const response = await API.patch(`/college/toggle-status/${id}`);
  return response.data;
};

export const setCollegePassword = async (payload) => {
  const response = await API.post("/college/set-password", payload);
  return response.data;
};


export const createEvent = async (payload) => {
  const response = await API.post("/event/create", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllEvents = async () => {
  const response = await API.get("/event/all");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await API.get(`/event/getById/${id}`);
  return response.data;
};

export const toggleEventStatus = async (id) => {
  const response = await API.patch(`/event/toggle-status/${id}`);
  return response.data;
};

export const addEventPost = async (id, formData) => {
  const response = await API.post(`/event/add-posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const createCompetition = async (payload) => {
  const response = await API.post("/competition/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllCompetitions = async () => {
  const response = await API.get("/competition/all");
  return response.data;
};

export const getCompetitionById = async (id) => {
  const response = await API.get(`/competition/getById/${id}`);
  return response.data;
};

export const toggleCompetitionStatus = async (id) => {
  const response = await API.patch(`/competition/toggle-status/${id}`);
  return response.data;
};

export const addCompetitionPost = async (id, formData) => {
  const response = await API.post(`/competition/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};



export const createConference = async (payload) => {
  const response = await API.post("/conference/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllConferences = async () => {
  const response = await API.get("/conference/all");
  return response.data;
};

export const getConferenceById = async (id) => {
  const response = await API.get(`/conference/getById/${id}`);
  return response.data;
};

export const toggleConferenceStatus = async (id) => {
  const response = await API.patch(`/conference/toggle-status/${id}`);
  return response.data;
};

export const addConferencePost = async (id, formData) => {
  const response = await API.post(`/conference/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const createSeminar = async (payload) => {
  const response = await API.post("/seminar/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllSeminars = async () => {
  const response = await API.get("/seminar/all");
  return response.data;
};

export const getSeminarById = async (id) => {
  const response = await API.get(`/seminar/getById/${id}`);
  return response.data;
};

export const toggleSeminarStatus = async (id) => {
  const response = await API.patch(`/seminar/toggle-status/${id}`);
  return response.data;
};

export const addSeminarPost = async (id, formData) => {
  const response = await API.post(`/seminar/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};






export const createInternship = async (payload) => {
  const response = await API.post("/internship/create", payload);
  return response.data;
};

export const getAllInternships = async () => {
  const response = await API.get("/internship/all");
  return response.data;
};

export const getInternshipById = async (id) => {
  const response = await API.get(`/internship/getById/${id}`);
  return response.data;
};

export const toggleInternshipStatus = async (id) => {
  const response = await API.patch(`/internship/toggle-status/${id}`);
  return response.data;
};




export const createFreelance = async (payload) => {
  const response = await API.post("/freelance/create", payload);
  return response.data;
};

export const getAllFreelances = async () => {
  const response = await API.get("/freelance/all");
  return response.data;
};

export const getFreelanceById = async (id) => {
  const response = await API.get(`/freelance/getById/${id}`);
  return response.data;
};

export const toggleFreelanceStatus = async (id) => {
  const response = await API.patch(`/freelance/toggle-status/${id}`);
  return response.data;
};
