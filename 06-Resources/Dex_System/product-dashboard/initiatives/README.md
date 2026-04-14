# Legacy folder

**Workspace markdown for initiatives now lives under [`06-Resources/Product_ideas/`](../../../Product_ideas/).**

`initiatives.json` uses vault-relative `contextFile` paths such as `06-Resources/Product_ideas/<id>.md`.

Regenerate from PRDs:

```bash
cd "$(dirname "$0")/.."
python3 build_initiatives_from_prds.py
```
