test:
	go test -race ./...

serve:
	cd site && npm install && npm run dev

.PHONY: test serve
