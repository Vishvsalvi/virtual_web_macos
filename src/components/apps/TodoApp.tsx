import React from "react";
import { 
  Input, 
  Button, 
  Checkbox, 
  Card, 
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Badge
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "danger"
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [newTodoText, setNewTodoText] = React.useState("");
  const [newTodoPriority, setNewTodoPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");
  const [selectedTodos, setSelectedTodos] = React.useState<string[]>([]);
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  
  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: uuidv4(),
        text: newTodoText.trim(),
        completed: false,
        priority: newTodoPriority,
        createdAt: new Date()
      };
      
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoText("");
    }
  };
  
  const toggleComplete = (id: string) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setSelectedTodos((prev) => prev.filter((todoId) => todoId !== id));
  };
  
  const updateTodoPriority = (id: string, priority: "low" | "medium" | "high") => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };
  
  const handleEditStart = (todo: Todo) => {
    setIsEditing(todo.id);
    setEditText(todo.text);
  };
  
  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      setTodos((prevTodos) => 
        prevTodos.map((todo) => 
          todo.id === id ? { ...todo, text: editText.trim() } : todo
        )
      );
    }
    setIsEditing(null);
    setEditText("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, id?: string) => {
    if (e.key === "Enter") {
      if (id) {
        handleEditSave(id);
      } else {
        addTodo();
      }
    } else if (e.key === "Escape" && id) {
      setIsEditing(null);
      setEditText("");
    }
  };
  
  const toggleSelectTodo = (id: string) => {
    setSelectedTodos((prev) => 
      prev.includes(id)
        ? prev.filter((todoId) => todoId !== id)
        : [...prev, id]
    );
  };
  
  const selectAllTodos = () => {
    const visibleTodoIds = filteredTodos.map(todo => todo.id);
    
    if (selectedTodos.length === visibleTodoIds.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(visibleTodoIds);
    }
  };
  
  const deleteSelectedTodos = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
  };
  
  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  const sortedTodos = React.useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Finally by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [filteredTodos]);
  
  const activeTodosCount = React.useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);
  
  const completedTodosCount = React.useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  return (
    <div className="flex flex-col h-full p-4">
      <Tabs 
        selectedKey={filter}
        onSelectionChange={key => setFilter(key as "all" | "active" | "completed")}
        variant="light"
        size="sm"
        aria-label="Todo filters"
        fullWidth
      >
        <Tab 
          key="all" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:list" className="w-4 h-4" />
              <span>All</span>
              <Badge size="sm" content={todos.length} />
            </div>
          } 
        />
        <Tab 
          key="active" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:circle" className="w-4 h-4" />
              <span>Active</span>
              <Badge size="sm" content={activeTodosCount} />
            </div>
          } 
        />
        <Tab 
          key="completed" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check-circle" className="w-4 h-4" />
              <span>Completed</span>
              <Badge size="sm" content={completedTodosCount} />
            </div>
          } 
        />
      </Tabs>

      <Card shadow="sm" className="my-4">
        <CardBody className="p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodoText}
              onValueChange={setNewTodoText}
              onKeyDown={handleKeyDown}
              endContent={
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      size="sm" 
                      isIconOnly 
                      variant="light" 
                      className={`text-${priorityColors[newTodoPriority]}`}
                    >
                      <Icon icon={
                        newTodoPriority === "high" ? "lucide:flag" : 
                        newTodoPriority === "medium" ? "lucide:flag" : 
                        "lucide:flag"
                      } />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Priority options">
                    <DropdownItem 
                      key="high" 
                      startContent={<Icon icon="lucide:flag" className="text-danger" />}
                      onPress={() => setNewTodoPriority("high")}
                    >
                      High
                    </DropdownItem>
                    <DropdownItem 
                      key="medium" 
                      startContent={<Icon icon="lucide:flag" className="text-warning" />}
                      onPress={() => setNewTodoPriority("medium")}
                    >
                      Medium
                    </DropdownItem>
                    <DropdownItem 
                      key="low" 
                      startContent={<Icon icon="lucide:flag" className="text-success" />}
                      onPress={() => setNewTodoPriority("low")}
                    >
                      Low
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              }
            />
            <Button 
              color="primary" 
              onPress={addTodo}
              startContent={<Icon icon="lucide:plus" />}
              className="sm:w-auto w-full"
            >
              Add
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {sortedTodos.length > 0 && (
        <div className="flex justify-between items-center mb-2 px-1">
          <Button 
            size="sm" 
            variant="light" 
            onPress={selectAllTodos}
            startContent={
              <Icon 
                icon={selectedTodos.length === sortedTodos.length ? "lucide:check-square" : "lucide:square"} 
                className="w-4 h-4" 
              />
            }
          >
            {selectedTodos.length === sortedTodos.length ? "Unselect All" : "Select All"}
          </Button>
          
          {selectedTodos.length > 0 && (
            <Button 
              size="sm" 
              color="danger" 
              variant="flat"
              onPress={deleteSelectedTodos}
              startContent={<Icon icon="lucide:trash-2" className="w-4 h-4" />}
            >
              Delete ({selectedTodos.length})
            </Button>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {sortedTodos.length > 0 ? (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {sortedTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    shadow="sm" 
                    className={`border-l-4 ${todo.completed ? "opacity-70" : ""} border-${priorityColors[todo.priority]}`}
                  >
                    <CardBody className="p-3">
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={selectedTodos.includes(todo.id)}
                          onValueChange={() => toggleSelectTodo(todo.id)}
                          size="sm"
                          className="mr-2"
                        />
                        
                        <Checkbox
                          lineThrough
                          isSelected={todo.completed}
                          onValueChange={() => toggleComplete(todo.id)}
                          size="sm" 
                          className={`flex-1 ${todo.completed ? "line-through text-default-400" : ""}`}
                        >
                          {isEditing === todo.id ? (
                            <Input
                              size="sm"
                              value={editText}
                              onValueChange={setEditText}
                              onKeyDown={(e) => handleKeyDown(e, todo.id)}
                              autoFocus
                              className="ml-2"
                              endContent={
                                <Button 
                                  size="sm" 
                                  isIconOnly 
                                  variant="light"
                                  onPress={() => handleEditSave(todo.id)}
                                >
                                  <Icon icon="lucide:check" className="w-4 h-4" />
                                </Button>
                              }
                            />
                          ) : (
                            <span className={`ml-2 ${todo.completed ? "line-through text-default-400" : ""}`}>
                              {todo.text}
                            </span>
                          )}
                        </Checkbox>

                        <div className="flex items-center ml-auto space-x-1">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button 
                                size="sm" 
                                isIconOnly 
                                variant="light" 
                                className={`text-${priorityColors[todo.priority]}`}
                              >
                                <Icon icon="lucide:flag" className="w-4 h-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Priority options">
                              <DropdownItem 
                                key="high" 
                                startContent={<Icon icon="lucide:flag" className="text-danger" />}
                                onPress={() => updateTodoPriority(todo.id, "high")}
                              >
                                High
                              </DropdownItem>
                              <DropdownItem 
                                key="medium" 
                                startContent={<Icon icon="lucide:flag" className="text-warning" />}
                                onPress={() => updateTodoPriority(todo.id, "medium")}
                              >
                                Medium
                              </DropdownItem>
                              <DropdownItem 
                                key="low" 
                                startContent={<Icon icon="lucide:flag" className="text-success" />}
                                onPress={() => updateTodoPriority(todo.id, "low")}
                              >
                                Low
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          
                          {isEditing !== todo.id && (
                            <Button 
                              size="sm" 
                              isIconOnly 
                              variant="light"
                              onPress={() => handleEditStart(todo)}
                            >
                              <Icon icon="lucide:edit-3" className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            isIconOnly 
                            variant="light" 
                            color="danger"
                            onPress={() => deleteTodo(todo.id)}
                          >
                            <Icon icon="lucide:trash-2" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-center"
            >
              <Icon icon="lucide:check-circle" className="w-12 h-12 text-default-300 mb-4" />
              <p className="text-default-500">
                {filter === "all" 
                  ? "No tasks yet. Add one above!" 
                  : filter === "active" 
                    ? "No active tasks. Great job!" 
                    : "No completed tasks yet."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoApp;