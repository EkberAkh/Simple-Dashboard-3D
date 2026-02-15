import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@/components/editor/Scene";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { AddObjectModal } from "@/components/editor/AddObjectModal";
import { EditObjectModal } from "@/components/editor/EditObjectModal";
import { useObjectStore } from "@/store/objectStore";
import { useDesignerStore } from "@/store/designerStore";
import { useEditorStore } from "@/store/editorStore";
import { MousePointerClick, Info } from "lucide-react";
import type { ObjectFormData } from "@/schemas/objectSchema";

export const EditorPage: React.FC = () => {
  const { objects, fetchObjects, addObject, updateObject, removeObject } =
    useObjectStore();
  const { designers, fetchDesigners } = useDesignerStore();
  const {
    selectedObjectId,
    pendingPlacement,
    selectObject,
    setPendingPlacement,
  } = useEditorStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  useEffect(() => {
    setIsMobilePanelOpen(false);
  }, [selectedObjectId]);

  useEffect(() => {
    fetchObjects();
    fetchDesigners();
  }, [fetchObjects, fetchDesigners]);

  const selectedObject = useMemo(
    () => objects.find((o) => o.id === selectedObjectId) ?? null,
    [objects, selectedObjectId],
  );

  const handleAddObject = useCallback(
    async (data: ObjectFormData) => {
      if (!pendingPlacement) return;
      await addObject({
        name: data.name,
        designerId: data.designerId,
        color: data.color,
        size: data.size,
        geometry: data.geometry,
        position: pendingPlacement,
      });
      await fetchDesigners();
      setPendingPlacement(null);
    },
    [pendingPlacement, addObject, fetchDesigners, setPendingPlacement],
  );

  const handleEditObject = useCallback(
    async (data: ObjectFormData) => {
      if (!selectedObject) return;
      await updateObject(selectedObject.id, {
        name: data.name,
        designerId: data.designerId,
        color: data.color,
        size: data.size,
        geometry: data.geometry,
      });
      await fetchDesigners();
    },
    [selectedObject, updateObject, fetchDesigners],
  );

  const handleDeleteObject = useCallback(
    async (id: string) => {
      await removeObject(id);
      selectObject(null);
      await fetchDesigners();
    },
    [removeObject, selectObject, fetchDesigners],
  );

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 50, near: 0.1, far: 100 }}
        style={{ background: "#0F172A" }}
      >
        <Scene objects={objects} />
      </Canvas>

      {objects.length === 0 && !pendingPlacement && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-center max-w-xs">
            <MousePointerClick
              size={24}
              className="text-primary-400 mx-auto mb-2 sm:hidden"
            />
            <MousePointerClick
              size={28}
              className="text-primary-400 mx-auto mb-2 hidden sm:block"
            />
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              Double-click on the grid to add an object
            </p>
            <p className="text-[10px] sm:text-xs text-white/50 mt-1">
              Click objects to select · Drag to move
            </p>
          </div>
        </div>
      )}

      <div
        className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-white/70"
        role="status"
        aria-live="polite"
      >
        {objects.length} object{objects.length !== 1 ? "s" : ""} in scene
      </div>

      {selectedObject && !isMobilePanelOpen && (
        <button
          onClick={() => setIsMobilePanelOpen(true)}
          className="
            fixed bottom-3 left-1/2 -translate-x-1/2 z-20
            flex items-center gap-2 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-2.5
            bg-slate-900/90 backdrop-blur-xl rounded-full
            border border-white/10 shadow-2xl
            animate-slide-up cursor-pointer
            active:scale-95 transition-transform
            md:hidden
          "
          aria-label={`View properties of ${selectedObject.name}`}
        >
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-2 ring-white/15 shrink-0"
            style={{ backgroundColor: selectedObject.color }}
          />
          <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-28 sm:max-w-32">
            {selectedObject.name}
          </span>
          <Info size={14} className="text-primary-400 shrink-0 sm:hidden" />
          <Info
            size={15}
            className="text-primary-400 shrink-0 hidden sm:block"
          />
        </button>
      )}

      {selectedObject && isMobilePanelOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40 z-10"
            onClick={() => setIsMobilePanelOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 bottom-0 z-20">
            <PropertiesPanel
              object={selectedObject}
              designers={designers}
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={handleDeleteObject}
              onClose={() => {
                setIsMobilePanelOpen(false);
                selectObject(null);
              }}
            />
          </div>
        </div>
      )}

      {selectedObject && (
        <div className="hidden md:block absolute top-3 right-3 z-10">
          <PropertiesPanel
            object={selectedObject}
            designers={designers}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDeleteObject}
            onClose={() => selectObject(null)}
          />
        </div>
      )}

      <AddObjectModal
        isOpen={pendingPlacement !== null}
        onClose={() => setPendingPlacement(null)}
        onSubmit={handleAddObject}
        designers={designers}
      />

      {selectedObject && (
        <EditObjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditObject}
          object={selectedObject}
          designers={designers}
        />
      )}
    </div>
  );
};
