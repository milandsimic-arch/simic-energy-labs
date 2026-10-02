// subtle scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold: 0.08});
document.querySelectorAll('.band, .prog').forEach(el => io.observe(el));
