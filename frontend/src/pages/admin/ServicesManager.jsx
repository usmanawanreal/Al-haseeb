import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createService,
  getActiveServices,
  removeService,
  updateService,
} from '../../services/api';

export default function ServicesManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      basePrice: '',
      icon: 'bi-heart-pulse',
      isAvailable24_7: true,
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getActiveServices();
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || e.message || 'Failed to load services');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onCreate = async (values) => {
    setError(null);
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        basePrice: Number(values.basePrice),
        icon: values.icon.trim() || 'bi-heart-pulse',
        isAvailable24_7: Boolean(values.isAvailable24_7),
      };
      if (Number.isNaN(payload.basePrice)) {
        setError('Base price must be a number.');
        return;
      }
      const { data } = await createService(payload);
      setRows((prev) => [data, ...prev]);
      reset();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Could not create service');
    }
  };

  const startEdit = (svc) => {
    setEditingId(svc._id);
    reset({
      title: svc.title,
      description: svc.description,
      basePrice: String(svc.basePrice),
      icon: svc.icon || 'bi-heart-pulse',
      isAvailable24_7: svc.isAvailable24_7 !== false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({
      title: '',
      description: '',
      basePrice: '',
      icon: 'bi-heart-pulse',
      isAvailable24_7: true,
    });
  };

  const onUpdateEdit = async (values) => {
    if (!editingId) return;
    setBusyId(editingId);
    setError(null);
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        basePrice: Number(values.basePrice),
        icon: values.icon.trim() || 'bi-heart-pulse',
        isAvailable24_7: Boolean(values.isAvailable24_7),
      };
      if (Number.isNaN(payload.basePrice)) {
        setError('Base price must be a number.');
        setBusyId(null);
        return;
      }
      const { data } = await updateService(editingId, payload);
      setRows((prev) => prev.map((r) => (r._id === editingId ? data : r)));
      cancelEdit();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this service? It will no longer appear for new bookings.')) return;
    setBusyId(id);
    setError(null);
    try {
      await removeService(id);
      setRows((prev) => prev.filter((r) => r._id !== id));
      if (editingId === id) cancelEdit();
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Could not deactivate');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <p className="admin-page-desc">
          Active services only are listed (per API). Deactivating removes a service from this list.
        </p>
      </header>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {editingId ? 'Edit service' : 'Add service'}
        </h2>
        <form
          className="admin-form-grid admin-form-grid--2"
          onSubmit={handleSubmit(editingId ? onUpdateEdit : onCreate)}
        >
          <div className="admin-field">
            <label htmlFor="svc-title">Title</label>
            <input id="svc-title" {...register('title', { required: true })} />
          </div>
          <div className="admin-field">
            <label htmlFor="svc-price">Base price</label>
            <input id="svc-price" type="number" step="any" {...register('basePrice', { required: true })} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="svc-desc">Description</label>
            <textarea id="svc-desc" {...register('description', { required: true })} />
          </div>
          <div className="admin-field">
            <label htmlFor="svc-icon">Icon key</label>
            <input id="svc-icon" {...register('icon')} placeholder="e.g. bi-heart-pulse" />
          </div>
          <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.4rem' }}>
            <input id="svc-247" type="checkbox" {...register('isAvailable24_7')} />
            <label htmlFor="svc-247" style={{ margin: 0 }}>
              Available 24/7
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={isSubmitting}>
              {editingId ? (isSubmitting ? 'Saving…' : 'Save changes') : isSubmitting ? 'Creating…' : 'Create service'}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn--danger" onClick={cancelEdit}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-panel">
        {loading ? (
          <p className="admin-muted" style={{ padding: '1.25rem' }}>
            Loading…
          </p>
        ) : rows.length === 0 ? (
          <p className="admin-muted" style={{ padding: '1.25rem' }}>
            No active services. Add one above.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>24/7</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s._id}>
                    <td>{s.title}</td>
                    <td>{s.basePrice}</td>
                    <td>{s.isAvailable24_7 ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--primary admin-btn--small"
                          disabled={busyId === s._id}
                          onClick={() => startEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          disabled={busyId === s._id}
                          onClick={() => handleDeactivate(s._id)}
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
