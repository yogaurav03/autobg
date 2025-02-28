import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ReusableModal = ({
  visible,
  title,
  content,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Modal Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.contentText}>{content}</Text>
          </View>

          {/* Modal Actions */}
          <View style={styles.actions}>
            {onClose && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  content: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 14,
  },
});

export default ReusableModal;
