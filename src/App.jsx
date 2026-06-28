import useTasks from "./hooks/useTasks";
import Confetti from "./components/Confetti";
import MotivationPopup from "./components/MotivationPopup";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import ProgressBar from "./components/ProgressBar";
import FilterTabs from "./components/FilterTabs";
import SearchBar from "./components/SearchBar";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";

export default function App() {
  const {
    filtered, total, done, inprogress, pending,
    confetti, motivation,
    showModal, form, setForm, editId,
    filterType,   setFilterType,
    filterStatus, setFilterStatus,
    searchQuery,  setSearchQuery,
    openAdd, openEdit, closeModal,
    saveTask, updateStatus, deleteTask,
    handleDragEnd,
  } = useTasks();

  return (
    <>
      <Confetti active={confetti} />
      <MotivationPopup data={motivation} />

      <div style={{ minHeight: "100vh", background: "#0a0a10", padding: "0 0 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
          <Header onAdd={openAdd} />
          <StatCards total={total} pending={pending} inprogress={inprogress} done={done} />
          <ProgressBar total={total} done={done} />
          <FilterTabs
            filterType={filterType}     setFilterType={setFilterType}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          />
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TaskList
              filtered={filtered} total={total}
              onDragEnd={handleDragEnd} onStatus={updateStatus}
              onEdit={openEdit} onDelete={deleteTask} onAdd={openAdd}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          form={form} setForm={setForm}
          onSave={saveTask} onClose={closeModal}
          isEdit={!!editId}
        />
      )}
    </>
  );
}
