import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

model_path = r"D:\IDE MINE\llm\Cybersecurity_razz"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True, local_files_only=True)

print("Configuring quantization and device map...")

# 1. Quantization config with CPU offload enabled
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    llm_int8_enable_fp32_cpu_offload=True,  # KEY: allows CPU offload
)

# 2. Custom device map – put the heavy output layer on CPU
device_map = {
    "model": 0,          # Main model on GPU 0
    "lm_head": "cpu",    # Output layer on CPU to save VRAM
}

print("Loading model... This may take a few minutes.")
try:
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map=device_map,
        quantization_config=quantization_config,
        trust_remote_code=True,
        local_files_only=True,
        torch_dtype=torch.float16
    )
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Model load failed: {e}")
    exit(1)

print("\n" + "="*50)
print("Model ready! Type 'exit' to quit.")
print("="*50 + "\n")

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    if not user_input.strip():
        continue

    prompt = f"User: {user_input}\nAssistant:"
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=512,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id or tokenizer.pad_token_id
        )
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        assistant_part = response.split("Assistant:")[-1].strip()
        print(f"Assistant: {assistant_part}\n")
    except Exception as e:
        print(f"❌ Error during generation: {e}")