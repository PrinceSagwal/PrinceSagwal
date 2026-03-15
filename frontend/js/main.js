document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setupContactForm();
  setupNavToggle();
});

// Determine the API base URL (same origin when served by the backend)
const API_BASE = window.location.origin;

// ===== Load Projects from Backend API =====
async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const projects = await res.json();
    grid.innerHTML = projects.map(projectCard).join("");
  } catch (err) {
    console.error("Failed to load projects:", err);
    grid.innerHTML = `<p style="text-align:center;color:var(--color-text-muted);">Unable to load projects. Please try again later.</p>`;
  }
}

function projectCard(project) {
  const techHtml = project.tech
    .map((t) => `<span>${t}</span>`)
    .join("");
  const liveLink =
    project.live && project.live !== "#"
      ? `<a href="${project.live}" target="_blank" rel="noopener">Live Demo &#x2197;</a>`
      : "";
  return `
    <article class="project-card">
      <img src="${project.image}" alt="${project.title}" />
      <div class="project-card-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">${techHtml}</div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noopener">GitHub &#x2197;</a>
          ${liveLink}
        </div>
      </div>
    </article>`;
}

// ===== Contact Form =====
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        status.textContent = "Message sent successfully!";
        status.classList.add("success");
        form.reset();
      } else {
        status.textContent = data.error || "Something went wrong.";
        status.classList.add("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      status.textContent = "Network error. Please try again.";
      status.classList.add("error");
    }
  });
}

// ===== Mobile Nav Toggle =====
function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    links.classList.toggle("active");
  });

  // Close menu when a link is clicked
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("active");
    });
  });
}
